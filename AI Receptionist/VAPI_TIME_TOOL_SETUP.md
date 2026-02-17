# ⏰ Vapi Time Tool Setup — How to Make the AI Know the Time

**Purpose:** Give the AI receptionist the ability to check the current time in MST so it can adjust its greeting based on whether the business is open or closed.

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

    // Get current time in Mountain Time (America/Denver handles MST/MDT automatically)
    const now = new Date();
    const options = {
      timeZone: "America/Denver",
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

    // Check business hours
    // Mon-Thu: 9am-5pm (9:00-17:00)
    // Fri: 9am-4pm (9:00-16:00)
    // Sat-Sun: Closed
    const dayMap = {
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3,
      "Thursday": 4, "Friday": 5, "Saturday": 6,
    };
    const dayNum = dayMap[weekday];
    let isOpen = false;

    if (dayNum >= 1 && dayNum <= 4) {
      // Monday-Thursday: 9am-5pm
      isOpen = hour24 >= 9 && hour24 < 17;
    } else if (dayNum === 5) {
      // Friday: 9am-4pm
      isOpen = hour24 >= 9 && hour24 < 16;
    }
    // Saturday (6) and Sunday (0) = closed

    const timeString = `${hour}:${minute} ${dayPeriod}`;
    const dateString = `${weekday}, ${month}/${day}/${year}`;

    const result = {
      results: [
        {
          toolCallId: "time-check",
          result: {
            currentTime: timeString,
            currentDate: dateString,
            dayOfWeek: weekday,
            timezone: "Mountain Time (MST/MDT)",
            isBusinessOpen: isOpen,
            businessHours: isOpen
              ? `The office IS OPEN right now. Current time: ${timeString} ${dateString}.`
              : `The office is CLOSED right now. Current time: ${timeString} ${dateString}. Business hours: Mon-Thu 9am-5pm, Fri 9am-4pm MST.`,
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

9. Click **"Save and Deploy"**
10. Copy the URL — it'll look something like: `https://get-current-time.YOUR-SUBDOMAIN.workers.dev`
11. **Test it** by visiting that URL in your browser — you should see the current MST time and whether the office is open

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

**Server URL:** `https://get-current-time.YOUR-SUBDOMAIN.workers.dev` (paste YOUR Cloudflare Worker URL here)

**No parameters needed** — leave parameters empty or set to none.

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
