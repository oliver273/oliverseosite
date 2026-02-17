# ⏰ Vapi Time Tool Setup — How to Make the AI Know the Time

**Purpose:** Give the AI receptionist the ability to check the current time so it can adjust its greeting based on whether the business is open or closed.

**Scales to unlimited clients** — one Cloudflare Worker + one Google Sheet. To add a new client, just add a row to the spreadsheet. No code editing ever again.

---

## STEP 1: Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Create a new spreadsheet**
2. Name it: **"AI Receptionist — Business Hours"**
3. Set up the columns **exactly** like this in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| client | name | timezone | mon_open | mon_close | tue_open | tue_close | wed_open | wed_close | thu_open | thu_close | fri_open | fri_close | sat_open | sat_close | sun_open | sun_close |

4. Add Mike as the first row (Row 2):

| client | name | timezone | mon_open | mon_close | tue_open | tue_close | wed_open | wed_close | thu_open | thu_close | fri_open | fri_close | sat_open | sat_close | sun_open | sun_close |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| farm-bureau | Farm Bureau Financial Services | America/Denver | 9 | 17 | 9 | 17 | 9 | 17 | 9 | 17 | 9 | 16 | | | | |

**Hours are in 24-hour format:**
- 9 = 9:00 AM
- 12 = 12:00 PM (noon)
- 13 = 1:00 PM
- 17 = 5:00 PM
- 16 = 4:00 PM
- Leave sat/sun columns **blank** = closed that day

5. **Publish the sheet:**
   - Go to **File → Share → Publish to web**
   - Under "Link", select the sheet tab (usually "Sheet1")
   - Change format from "Web page" to **"Comma-separated values (.csv)"**
   - Click **"Publish"**
   - **Copy the URL** it gives you — it looks like:
     `https://docs.google.com/spreadsheets/d/e/XXXXX/pub?gid=0&single=true&output=csv`
   - **Save this URL** — you'll paste it into the Cloudflare Worker

---

## STEP 2: Create the Cloudflare Worker

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create"** → **"Create Worker"**
4. Name it: `get-current-time`
5. Click **"Deploy"** (it creates a default worker)
6. Click **"Edit Code"** (or "Quick Edit")
7. **Delete everything** in the code editor and paste this:

```javascript
export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // ============================================================
    // 🔗 PASTE YOUR GOOGLE SHEETS CSV URL BELOW
    // ============================================================
    const SHEET_CSV_URL = "PASTE_YOUR_PUBLISHED_CSV_URL_HERE";

    // ============================================================
    // DETERMINE WHICH CLIENT IS CALLING
    // ============================================================
    let clientId = "farm-bureau"; // default fallback

    // Check URL parameter: ?client=farm-bureau
    const url = new URL(request.url);
    if (url.searchParams.has("client")) {
      clientId = url.searchParams.get("client");
    }

    // Check POST body (for Vapi tool calls)
    if (request.method === "POST") {
      try {
        const body = await request.clone().json();
        if (body?.message?.toolCallList?.[0]?.function?.arguments?.client) {
          clientId = body.message.toolCallList[0].function.arguments.client;
        }
      } catch (e) {
        // If body parsing fails, use URL parameter or default
      }
    }

    // ============================================================
    // FETCH CLIENT HOURS FROM GOOGLE SHEETS
    // ============================================================
    let client = null;

    try {
      const sheetResponse = await fetch(SHEET_CSV_URL, {
        cf: { cacheTtl: 300 }, // Cache for 5 minutes so it's fast
      });
      const csvText = await sheetResponse.text();
      const rows = csvText.split("\n").map(row => {
        // Handle CSV parsing (basic — works for simple values without commas in them)
        return row.split(",").map(cell => cell.trim().replace(/^"|"$/g, ""));
      });

      // Row 0 = headers, Row 1+ = data
      const headers = rows[0];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row[0] === clientId) {
          client = {
            name: row[headers.indexOf("name")] || "Unknown Business",
            timezone: row[headers.indexOf("timezone")] || "America/Denver",
            hours: {},
          };

          // Parse hours: mon=1, tue=2, wed=3, thu=4, fri=5, sat=6, sun=0
          const dayMapping = [
            { prefix: "mon", dayNum: 1 },
            { prefix: "tue", dayNum: 2 },
            { prefix: "wed", dayNum: 3 },
            { prefix: "thu", dayNum: 4 },
            { prefix: "fri", dayNum: 5 },
            { prefix: "sat", dayNum: 6 },
            { prefix: "sun", dayNum: 0 },
          ];

          for (const { prefix, dayNum } of dayMapping) {
            const openCol = headers.indexOf(`${prefix}_open`);
            const closeCol = headers.indexOf(`${prefix}_close`);
            const openVal = row[openCol];
            const closeVal = row[closeCol];
            if (openVal && closeVal && openVal !== "" && closeVal !== "") {
              client.hours[dayNum] = {
                open: parseInt(openVal),
                close: parseInt(closeVal),
              };
            }
          }
          break;
        }
      }
    } catch (e) {
      // If Google Sheets fetch fails, return a safe fallback
    }

    // If client not found, return a safe "closed" fallback
    if (!client) {
      const result = {
        results: [{
          toolCallId: "time-check",
          result: {
            currentTime: "unknown",
            currentDate: "unknown",
            dayOfWeek: "unknown",
            timezone: "unknown",
            businessName: "Unknown",
            isBusinessOpen: false,
            businessHours: "Could not determine business hours. Default to after-hours greeting.",
          },
        }],
      };
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // ============================================================
    // GET CURRENT TIME IN CLIENT'S TIMEZONE
    // ============================================================
    const now = new Date();
    const options = {
      timeZone: client.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      weekday: "long",
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(now);

    const weekday = parts.find(p => p.type === "weekday").value;
    const month = parts.find(p => p.type === "month").value;
    const day = parts.find(p => p.type === "day").value;
    const year = parts.find(p => p.type === "year").value;
    const hour = parseInt(parts.find(p => p.type === "hour").value);
    const minute = parts.find(p => p.type === "minute").value;
    const dayPeriod = parts.find(p => p.type === "dayPeriod").value;

    // Convert to 24-hour for business hours check
    let hour24 = hour;
    if (dayPeriod === "PM" && hour !== 12) hour24 = hour + 12;
    if (dayPeriod === "AM" && hour === 12) hour24 = 0;

    // Check if business is open
    const dayMap = {
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
      "Thursday": 4, "Friday": 5, "Saturday": 6,
    };
    const dayNum = dayMap[weekday];
    let isOpen = false;

    if (client.hours[dayNum]) {
      isOpen = hour24 >= client.hours[dayNum].open && hour24 < client.hours[dayNum].close;
    }

    const timeString = `${hour}:${minute} ${dayPeriod}`;
    const dateString = `${weekday}, ${month}/${day}/${year}`;

    // Build hours description for the AI
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let hoursDesc = [];
    for (const [d, h] of Object.entries(client.hours)) {
      const openAmPm = h.open >= 12 ? `${h.open === 12 ? 12 : h.open - 12}pm` : `${h.open}am`;
      const closeAmPm = h.close >= 12 ? `${h.close === 12 ? 12 : h.close - 12}pm` : `${h.close}am`;
      hoursDesc.push(`${dayNames[d]}: ${openAmPm}-${closeAmPm}`);
    }

    const result = {
      results: [
        {
          toolCallId: "time-check",
          result: {
            currentTime: timeString,
            currentDate: dateString,
            dayOfWeek: weekday,
            timezone: client.timezone,
            businessName: client.name,
            isBusinessOpen: isOpen,
            businessHours: isOpen
              ? `The office IS OPEN right now. Current time: ${timeString} ${dateString}.`
              : `The office is CLOSED right now. Current time: ${timeString} ${dateString}. Business hours: ${hoursDesc.join(", ")}.`,
          },
        },
      ],
    };

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
```

8. **⚠️ IMPORTANT:** Replace `PASTE_YOUR_PUBLISHED_CSV_URL_HERE` on line 15 with the Google Sheets CSV URL you copied in Step 1.
9. Click **"Save and Deploy"**
10. Copy the Worker URL — it looks like: `https://get-current-time.YOUR-SUBDOMAIN.workers.dev`
11. **Test it** in your browser: `https://get-current-time.YOUR-SUBDOMAIN.workers.dev?client=farm-bureau`
    - You should see the current MST time and `isBusinessOpen: true` or `false`

---

## STEP 3: Add the Tool in Vapi

1. Go to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Open your **Mike's Farm Bureau** assistant
3. Look for a **"Tools"** or **"Functions"** section
4. Click **"Add Tool"** or **"Add Function"**
5. Configure it like this:

**Tool Name:** `check_current_time`

**Description:**
```
Returns the current time and whether the business is currently open or closed. ALWAYS call this tool at the very start of every call before your first greeting.
```

**Server URL:** `https://get-current-time.YOUR-SUBDOMAIN.workers.dev?client=farm-bureau` (YOUR Worker URL + client slug)

**No parameters needed** — the client is identified by the URL. Leave parameters empty.

> **For each new client**, just change `?client=` to match their slug from the Google Sheet.

---

## STEP 4: Update the System Prompt

Already done — the prompt files already tell the AI to call `check_current_time` first.

---

## How It Works (The Flow)

1. ☎️ A call comes in
2. 🤖 The AI calls the `check_current_time` tool (before saying anything)
3. 🔧 The Cloudflare Worker fetches the Google Sheet → finds the client's hours → checks the time
4. ⏰ Returns: `{ isBusinessOpen: true/false, businessHours: "The office IS OPEN..." }`
5. 💬 The AI uses the correct greeting:
   - **Open:** "Thank you for calling Farm Bureau Financial Services! How can I help you today?"
   - **Closed:** "Thank you for calling Farm Bureau Financial Services. We're currently closed, but I'd be happy to take your information..."

---

## 🆕 Adding a New Client (1 minute — NO code changes)

When you sign a new client:

1. **Open the Google Sheet**
2. **Add a new row** with their info:

| client | name | timezone | mon_open | mon_close | ... |
|---|---|---|---|---|---|
| texas-dentist | Smile Dental | America/Chicago | 8 | 17 | ... |

3. **In their Vapi assistant**, set the tool Server URL to:
   `https://get-current-time.YOUR-SUBDOMAIN.workers.dev?client=texas-dentist`

**That's it.** No code changes, no redeploying. The worker reads the sheet live.

---

## Quick Reference: Hours Format

**24-hour clock:**
| Time | Value |
|---|---|
| 6:00 AM | 6 |
| 7:00 AM | 7 |
| 8:00 AM | 8 |
| 9:00 AM | 9 |
| 10:00 AM | 10 |
| 11:00 AM | 11 |
| 12:00 PM (noon) | 12 |
| 1:00 PM | 13 |
| 2:00 PM | 14 |
| 3:00 PM | 15 |
| 4:00 PM | 16 |
| 5:00 PM | 17 |
| 6:00 PM | 18 |
| 7:00 PM | 19 |
| 8:00 PM | 20 |

**Common timezones:**
| Location | Timezone Value |
|---|---|
| Wyoming, Colorado, Montana | `America/Denver` (Mountain) |
| Texas, Illinois, Wisconsin | `America/Chicago` (Central) |
| New York, Florida, Georgia | `America/New_York` (Eastern) |
| California, Oregon, Washington | `America/Los_Angeles` (Pacific) |
| Arizona (no daylight saving) | `America/Phoenix` |

**Closed days:** Just leave the open/close columns blank for that day.

---

## Example: 3 Clients in the Google Sheet

| client | name | timezone | mon_open | mon_close | tue_open | tue_close | wed_open | wed_close | thu_open | thu_close | fri_open | fri_close | sat_open | sat_close | sun_open | sun_close |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| farm-bureau | Farm Bureau Financial Services | America/Denver | 9 | 17 | 9 | 17 | 9 | 17 | 9 | 17 | 9 | 16 | | | | |
| texas-dentist | Smile Dental | America/Chicago | 8 | 17 | 8 | 17 | 8 | 17 | 8 | 17 | 8 | 14 | | | | |
| ny-law-firm | Johnson & Associates | America/New_York | 9 | 18 | 9 | 18 | 9 | 18 | 9 | 18 | 9 | 17 | 10 | 14 | | |

**Vapi tool URLs:**
- Mike: `...?client=farm-bureau`
- Dentist: `...?client=texas-dentist`
- Law firm: `...?client=ny-law-firm`

---

## Testing

After setup, test with these scenarios:
- [ ] Visit `YOUR-WORKER-URL?client=farm-bureau` in browser → Should show current time + open/closed
- [ ] Call during business hours → AI should NOT say "we're closed"
- [ ] Call after hours → AI should say "we're currently closed"
- [ ] Call on weekend → AI should say "we're currently closed"
- [ ] Add a test row to the sheet → Visit `?client=test-row` → Should pick up the new hours

---

## Troubleshooting

**Worker returns "Could not determine business hours":**
- Check that the `client` parameter in the URL matches the value in column A of the sheet
- Make sure the sheet is still published (File → Share → Publish to web)
- Visit the CSV URL directly in your browser — you should see raw CSV data

**AI doesn't call the tool:**
- Make sure the tool description says "ALWAYS call this at the very start of every call"
- Make sure the system prompt starts with the instruction to call `check_current_time` first

**Sheet changes don't show up immediately:**
- The Worker caches the sheet for 5 minutes for speed. Changes will take up to 5 min to appear.
- To test immediately, add `?nocache=1` to the Worker URL

**AI says the wrong greeting:**
- Check the Worker URL in browser — is `isBusinessOpen` correct?
- Verify the hours in the Google Sheet are in 24-hour format

---

## Costs

- **Cloudflare Worker:** FREE (100,000 requests/day)
- **Google Sheets:** FREE
- **Total cost:** $0/month forever
