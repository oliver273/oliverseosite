# ⏰ Vapi Time Tool Setup — How to Make the AI Know the Time

**Purpose:** Give the AI receptionist the ability to check the current time so it can adjust its greeting based on whether the business is open or closed.

**Scales to unlimited clients** — one Cloudflare Worker + one Google Sheet. To add a new client, just add a row to the spreadsheet. No code editing ever again.

**Supports lunch breaks / split hours** — each day has two time blocks. Block 1 = morning, Block 2 = afternoon. If there's no break, just use Block 1 and leave Block 2 blank.

---

## STEP 1: Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Create a new spreadsheet**
2. Name it: **"AI Receptionist — Business Hours"**
3. Set up the columns **exactly** like this in Row 1:

| A | B | C |
|---|---|---|
| client | name | timezone |

Then for each day, there are 4 columns (2 time blocks):

| D | E | F | G | H | I | J | K | ... |
|---|---|---|---|---|---|---|---|---|
| mon_open1 | mon_close1 | mon_open2 | mon_close2 | tue_open1 | tue_close1 | tue_open2 | tue_close2 | ... |

**Full column list (31 columns total):**
```
client, name, timezone,
mon_open1, mon_close1, mon_open2, mon_close2,
tue_open1, tue_close1, tue_open2, tue_close2,
wed_open1, wed_close1, wed_open2, wed_close2,
thu_open1, thu_close1, thu_open2, thu_close2,
fri_open1, fri_close1, fri_open2, fri_close2,
sat_open1, sat_close1, sat_open2, sat_close2,
sun_open1, sun_close1, sun_open2, sun_close2
```

4. **Add Mike** as the first row (Row 2). He has NO lunch break, so only Block 1 is filled:

| client | name | timezone | mon_open1 | mon_close1 | mon_open2 | mon_close2 | tue_open1 | tue_close1 | tue_open2 | tue_close2 | wed_open1 | wed_close1 | wed_open2 | wed_close2 | thu_open1 | thu_close1 | thu_open2 | thu_close2 | fri_open1 | fri_close1 | fri_open2 | fri_close2 | sat_open1 | sat_close1 | sat_open2 | sat_close2 | sun_open1 | sun_close1 | sun_open2 | sun_close2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| farm-bureau | Farm Bureau Financial Services | America/Denver | 9 | 17 | | | 9 | 17 | | | 9 | 17 | | | 9 | 17 | | | 9 | 16 | | | | | | | | | | |

**Example: A dentist with a lunch break** (closed 12-1pm):

| client | name | timezone | mon_open1 | mon_close1 | mon_open2 | mon_close2 | ... |
|---|---|---|---|---|---|---|---|
| texas-dentist | Smile Dental | America/Chicago | 8 | 12 | 13 | 17 | ... |

This means: Open 8am-12pm, closed for lunch 12-1pm, open 1pm-5pm.

**No break?** Just fill Block 1, leave Block 2 blank (like Mike).

5. **Publish the sheet:**
   - Go to **File → Share → Publish to web**
   - Under "Link", select the sheet tab (usually "Sheet1")
   - Change format from "Web page" to **"Comma-separated values (.csv)"**
   - Click **"Publish"**
   - **Copy the URL** — it looks like:
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

          // Parse hours with TWO blocks per day (supports lunch breaks)
          // mon=1, tue=2, wed=3, thu=4, fri=5, sat=6, sun=0
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
            const blocks = [];

            // Block 1 (morning or full day)
            const open1 = row[headers.indexOf(`${prefix}_open1`)];
            const close1 = row[headers.indexOf(`${prefix}_close1`)];
            if (open1 && close1 && open1 !== "" && close1 !== "") {
              blocks.push({ open: parseInt(open1), close: parseInt(close1) });
            }

            // Block 2 (afternoon, after lunch break)
            const open2 = row[headers.indexOf(`${prefix}_open2`)];
            const close2 = row[headers.indexOf(`${prefix}_close2`)];
            if (open2 && close2 && open2 !== "" && close2 !== "") {
              blocks.push({ open: parseInt(open2), close: parseInt(close2) });
            }

            if (blocks.length > 0) {
              client.hours[dayNum] = blocks;
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

    // Check if business is open (supports multiple blocks per day)
    const dayMap = {
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
      "Thursday": 4, "Friday": 5, "Saturday": 6,
    };
    const dayNum = dayMap[weekday];
    let isOpen = false;
    let isOnBreak = false;

    if (client.hours[dayNum]) {
      const blocks = client.hours[dayNum];
      for (const block of blocks) {
        if (hour24 >= block.open && hour24 < block.close) {
          isOpen = true;
          break;
        }
      }
      // Check if they're on a break (between block 1 close and block 2 open)
      if (!isOpen && blocks.length === 2) {
        if (hour24 >= blocks[0].close && hour24 < blocks[1].open) {
          isOnBreak = true;
        }
      }
    }

    const timeString = `${hour}:${minute} ${dayPeriod}`;
    const dateString = `${weekday}, ${month}/${day}/${year}`;

    // Build hours description for the AI
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let hoursDesc = [];
    for (const [d, blocks] of Object.entries(client.hours)) {
      const formatTime = (h) => {
        if (h === 0) return "12am";
        if (h === 12) return "12pm";
        return h > 12 ? `${h - 12}pm` : `${h}am`;
      };
      const blockStrings = blocks.map(b => `${formatTime(b.open)}-${formatTime(b.close)}`);
      hoursDesc.push(`${dayNames[d]}: ${blockStrings.join(", ")}`);
    }

    // Build the status message
    let statusMessage;
    if (isOpen) {
      statusMessage = `The office IS OPEN right now. Current time: ${timeString} ${dateString}.`;
    } else if (isOnBreak) {
      statusMessage = `The office is currently ON BREAK (lunch/break time) but will reopen later today. Current time: ${timeString} ${dateString}. Business hours: ${hoursDesc.join("; ")}.`;
    } else {
      statusMessage = `The office is CLOSED right now. Current time: ${timeString} ${dateString}. Business hours: ${hoursDesc.join("; ")}.`;
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
            isOnBreak: isOnBreak,
            businessHours: statusMessage,
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
4. ⏰ Returns: `{ isBusinessOpen: true/false, isOnBreak: true/false, businessHours: "..." }`
5. 💬 The AI uses the correct greeting:
   - **Open:** "Thank you for calling [Business]! How can I help you today?"
   - **On break:** "Thank you for calling [Business]. The office is on a short break but will reopen later today. I'd be happy to take your information..."
   - **Closed:** "Thank you for calling [Business]. We're currently closed, but I'd be happy to take your information..."

---

## 🆕 Adding a New Client (1 minute — NO code changes)

When you sign a new client:

1. **Open the Google Sheet**
2. **Add a new row** with their info
3. **In their Vapi assistant**, set the tool Server URL to:
   `https://get-current-time.YOUR-SUBDOMAIN.workers.dev?client=their-slug`

**That's it.** No code changes, no redeploying.

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

---

## Google Sheet Examples

### Simple: No lunch break (like Mike)
| client | name | timezone | mon_open1 | mon_close1 | mon_open2 | mon_close2 |
|---|---|---|---|---|---|---|
| farm-bureau | Farm Bureau Financial Services | America/Denver | 9 | 17 | | |

→ Open 9am-5pm straight through. Block 2 is blank = no break.

### With lunch break: Closed 12-1pm
| client | name | timezone | mon_open1 | mon_close1 | mon_open2 | mon_close2 |
|---|---|---|---|---|---|---|
| texas-dentist | Smile Dental | America/Chicago | 8 | 12 | 13 | 17 |

→ Open 8am-12pm, closed for lunch 12-1pm, open 1pm-5pm.

### With lunch break: Closed 12-1:30pm
| client | name | timezone | mon_open1 | mon_close1 | mon_open2 | mon_close2 |
|---|---|---|---|---|---|---|
| law-firm | Johnson Law | America/New_York | 9 | 12 | 13.5 | 18 |

→ Open 9am-12pm, closed 12-1:30pm, open 1:30pm-6pm. (Use 13.5 for 1:30pm)

### Saturday half-day, no break
| client | ... | sat_open1 | sat_close1 | sat_open2 | sat_close2 |
|---|---|---|---|---|---|
| hvac-company | ... | 8 | 12 | | |

→ Saturday 8am-12pm only. No afternoon block.

### Closed all day (leave ALL columns blank)
| client | ... | sun_open1 | sun_close1 | sun_open2 | sun_close2 |
|---|---|---|---|---|---|
| any-business | ... | | | | |

→ Sunday = closed.

---

## Half-Hour Times

For times like 8:30 AM or 1:30 PM, use decimals:
| Time | Value |
|---|---|
| 8:30 AM | 8.5 |
| 9:30 AM | 9.5 |
| 12:30 PM | 12.5 |
| 1:30 PM | 13.5 |
| 5:30 PM | 17.5 |

---

## Testing

After setup, test with these scenarios:
- [ ] Visit `YOUR-WORKER-URL?client=farm-bureau` in browser → Should show current time + open/closed
- [ ] Call during business hours → AI should NOT say "we're closed"
- [ ] Call during lunch break → AI should say "on a short break"
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
- To test immediately, add `&nocache=1` to the Worker URL

**AI says the wrong greeting:**
- Check the Worker URL in browser — is `isBusinessOpen` correct?
- Verify the hours in the Google Sheet are in 24-hour format

---

## Costs

- **Cloudflare Worker:** FREE (100,000 requests/day)
- **Google Sheets:** FREE
- **Total cost:** $0/month forever
