# ⏰ Vapi Time Tool Setup — How to Make the AI Know the Time

**Purpose:** Give the AI receptionist the ability to check the current time so it can adjust its greeting based on whether the business is open or closed.

**Scales to unlimited clients** — one Cloudflare Worker handles ALL clients. Each client's hours and timezone are stored in the worker. When you onboard a new client, just add their hours to the code and set their Vapi tool URL with `?client=client-slug`.

---

## STEP 1: Create a Cloudflare Worker

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create"**
4. Click **"Create Worker"**
5. Name it: `get-current-time`
6. Click **"Deploy"** (it creates a default worker)
7. Click **"Edit Code"** (or "Quick Edit")
8. **Delete everything** in the code editor and paste this:

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
    // CLIENT DATABASE — Add new clients here as you onboard them
    // ============================================================
    const clients = {
      "farm-bureau": {
        name: "Farm Bureau Financial Services",
        timezone: "America/Denver",  // MST/MDT (auto-adjusts for daylight saving)
        hours: {
          1: { open: 9, close: 17 },  // Monday: 9am-5pm
          2: { open: 9, close: 17 },  // Tuesday: 9am-5pm
          3: { open: 9, close: 17 },  // Wednesday: 9am-5pm
          4: { open: 9, close: 17 },  // Thursday: 9am-5pm
          5: { open: 9, close: 16 },  // Friday: 9am-4pm
          // 0 (Sunday) and 6 (Saturday) = not listed = closed
        },
      },
      // -------------------------------------------------------
      // TO ADD A NEW CLIENT, copy this template and fill it in:
      // -------------------------------------------------------
      // "client-slug": {
      //   name: "Business Name",
      //   timezone: "America/Denver",  // or "America/Chicago", "America/New_York", "America/Los_Angeles"
      //   hours: {
      //     1: { open: 9, close: 17 },  // Monday
      //     2: { open: 9, close: 17 },  // Tuesday
      //     3: { open: 9, close: 17 },  // Wednesday
      //     4: { open: 9, close: 17 },  // Thursday
      //     5: { open: 9, close: 17 },  // Friday
      //     6: { open: 10, close: 14 }, // Saturday (optional)
      //     // 0 = Sunday (leave out if closed)
      //   },
      // },
    };

    // ============================================================
    // DETERMINE WHICH CLIENT IS CALLING
    // ============================================================
    let clientId = "farm-bureau"; // default

    // Check URL parameter: ?client=farm-bureau
    const url = new URL(request.url);
    if (url.searchParams.has("client")) {
      clientId = url.searchParams.get("client");
    }

    // Check POST body (for Vapi tool calls)
    if (request.method === "POST") {
      try {
        const body = await request.clone().json();
        // Vapi sends tool call arguments in message.toolCallList[0].function.arguments
        if (body?.message?.toolCallList?.[0]?.function?.arguments?.client) {
          clientId = body.message.toolCallList[0].function.arguments.client;
        }
      } catch (e) {
        // If body parsing fails, use default
      }
    }

    const client = clients[clientId] || clients["farm-bureau"];

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

    // Check if business is open based on client's hours
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

**How to add a new client:** Just add a new entry to the `clients` object at the top of the code. Example for a dentist in Chicago:

```javascript
"chicago-dentist": {
  name: "Smile Dental",
  timezone: "America/Chicago",  // Central Time
  hours: {
    1: { open: 8, close: 17 },  // Monday: 8am-5pm
    2: { open: 8, close: 17 },  // Tuesday
    3: { open: 8, close: 17 },  // Wednesday
    4: { open: 8, close: 17 },  // Thursday
    5: { open: 8, close: 14 },  // Friday: 8am-2pm
  },
},
```

Then in that client's Vapi tool, set the Server URL to:
`https://get-current-time.YOUR-SUBDOMAIN.workers.dev?client=chicago-dentist`

9. Click **"Save and Deploy"**
10. Copy the URL — it'll look something like: `https://get-current-time.YOUR-SUBDOMAIN.workers.dev`
11. **Test it** by visiting that URL in your browser — you should see the current time and whether the office is open
12. **For Mike**, use: `https://get-current-time.YOUR-SUBDOMAIN.workers.dev?client=farm-bureau`
13. **For future clients**, add them to the `clients` object and use `?client=their-slug`

---

## STEP 2: Add the Tool in Vapi

1. Go to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Open your **Mike's Farm Bureau** assistant
3. Look for a **"Tools"** or **"Functions"** section
4. Click **"Add Tool"** or **"Add Function"**
5. Configure it like this:

**Tool Name:** `check_current_time`

**Description:** 
```
Returns the current time in Mountain Time (MST) and whether the business is currently open or closed. ALWAYS call this tool at the very start of every call before your first greeting.
```

**Server URL:** `https://get-current-time.YOUR-SUBDOMAIN.workers.dev?client=farm-bureau` (paste YOUR Worker URL + client slug)

**No parameters needed** — the client is identified by the URL. Leave parameters empty or set to none.

> **For each new client's Vapi assistant**, just change the `?client=` part of the URL to match their slug in the worker code.

---

## STEP 3: Update the System Prompt

The prompt is already set up with time-aware instructions. You just need to add one line at the very top of the system prompt:

**Add this at the very beginning of the system prompt:**
```
BEFORE YOUR FIRST RESPONSE ON EVERY CALL, you MUST call the check_current_time tool to find out if the business is open or closed. Use the result to choose the correct greeting. Do NOT guess the time — always call the tool first.
```

---

## How It Works (The Flow)

1. ☎️ A call comes in
2. 🤖 The AI sees "call check_current_time first" in the prompt
3. 🔧 The AI calls the Cloudflare Worker tool
4. ⏰ The Worker returns: `{ isBusinessOpen: true/false, businessHours: "The office IS OPEN..." }`
5. 💬 The AI uses the correct greeting:
   - **Open:** "Thank you for calling Farm Bureau Financial Services! How can I help you today?"
   - **Closed:** "Thank you for calling Farm Bureau Financial Services. We're currently closed, but I'd be happy to take your information..."

---

---

## Adding a New Client (2 min per client)

When you sign a new client, here's all you do:

1. **Open the Cloudflare Worker** → Edit Code
2. **Add their hours** to the `clients` object (copy the template, fill in name/timezone/hours)
3. **Save and Deploy**
4. **In their Vapi assistant**, set the tool Server URL to: `https://get-current-time.YOUR-SUBDOMAIN.workers.dev?client=their-slug`

That's it. One worker, unlimited clients.

**Common timezones:**
| Location | Timezone |
|---|---|
| Wyoming, Colorado, Montana | `America/Denver` (Mountain) |
| Texas, Illinois, Wisconsin | `America/Chicago` (Central) |
| New York, Florida, Georgia | `America/New_York` (Eastern) |
| California, Oregon, Washington | `America/Los_Angeles` (Pacific) |

---

## Testing

After setup, test with these scenarios:
- [ ] Call during business hours → Should NOT say "we're closed"
- [ ] Call after hours → Should say "we're currently closed"
- [ ] Call on weekend → Should say "we're currently closed"
- [ ] Visit the Worker URL in browser → Should show current MST time

---

## Troubleshooting

**AI doesn't call the tool:**
- Make sure the tool description says to call it "at the very start of every call"
- Make sure the prompt starts with the instruction to call check_current_time FIRST

**Worker returns wrong time:**
- The Worker uses "America/Denver" timezone which automatically handles MST/MDT daylight saving
- Test by visiting the Worker URL in your browser

**AI says the wrong greeting:**
- Check the Worker URL — is `isBusinessOpen` correct?
- Make sure the prompt instructions match the time-aware greetings in CALL_SCRIPT.md

---

**Cloudflare Workers Free Tier:** 100,000 requests/day — you'll never hit this. It's completely free.
