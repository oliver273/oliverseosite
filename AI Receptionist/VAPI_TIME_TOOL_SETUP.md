# ⏰ Vapi Time Tool Setup — How to Make the AI Know the Time

**Purpose:** Give the AI the current time. The AI already knows the business hours from its prompt — it just needs to know what time it is right now.

**One Cloudflare Worker. Works for ALL clients. No client database, no Google Sheets, no per-client config.** The AI handles the timezone math and business hours logic itself.

---

## STEP 1: Create a Cloudflare Worker

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create"** → **"Create Worker"**
4. Name it: `get-current-time`
5. Click **"Deploy"** (it creates a default worker)
6. Click **"Edit Code"** (or "Quick Edit")
7. **Delete everything** and paste this:

```javascript
export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Read the toolCallId from Vapi's request (Vapi needs it echoed back)
    let toolCallId = "time-check";
    if (request.method === "POST") {
      try {
        const body = await request.json();
        if (body?.message?.toolCallList?.[0]?.id) {
          toolCallId = body.message.toolCallList[0].id;
        }
      } catch (e) {
        // If parsing fails, use default
      }
    }

    const now = new Date();

    const result = {
      results: [
        {
          toolCallId: toolCallId,
          result: JSON.stringify({
            utc: now.toISOString(),
            utc_readable: now.toUTCString(),
            unix_timestamp: Math.floor(now.getTime() / 1000),
          }),
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

8. Click **"Save and Deploy"**
9. Copy the URL — something like: `https://get-current-time.YOUR-SUBDOMAIN.workers.dev`
10. **Test it** in your browser — you should see the current UTC time

That's the entire worker. ~20 lines. Done forever. Works for every client.

---

## STEP 2: Add the Tool in Vapi

1. Go to [dashboard.vapi.ai](https://dashboard.vapi.ai)
2. Open your assistant (Mike's, the demo, any client)
3. Find **"Tools"** or **"Functions"** → **"Add Tool"**
4. Configure:

**Tool Name:** `check_current_time`

**Description:**
```
Returns the current UTC time. ALWAYS call this tool at the very start of every call before your first greeting. Use the UTC time to determine the local time based on the timezone in your instructions.
```

**Server URL:** `https://get-current-time.YOUR-SUBDOMAIN.workers.dev`

**No parameters needed.**

> **Same URL for every client.** The AI figures out the local time from its prompt.

---

## STEP 3: Add This to Each Client's System Prompt

Each client's prompt already has business hours listed. Just make sure the prompt includes:

1. **The timezone** (e.g., "Mountain Time / MST, which is UTC-7, or MDT UTC-6 during daylight saving")
2. **The business hours**
3. **The instruction to call the tool first**

The AI will:
1. Call the tool → get UTC time
2. Convert UTC to the client's local timezone (from the prompt)
3. Compare to the business hours (from the prompt)
4. Use the right greeting

---

## What Goes in Each Client's Prompt

Just include a section like this in each client's system prompt:

```
BEFORE YOUR FIRST RESPONSE ON EVERY CALL, you MUST call the check_current_time tool. It returns the current time in UTC. Convert it to the local timezone below, then decide if the business is open or closed.

TIMEZONE: Mountain Time (UTC-7 MST / UTC-6 MDT during daylight saving, March-November)

BUSINESS HOURS:
- Monday-Thursday: 9:00 AM - 5:00 PM
- Friday: 9:00 AM - 4:00 PM
- Saturday-Sunday: CLOSED

IF the business is currently OPEN:
- Greeting: "Thank you for calling [Business Name]! How can I help you today?"
- Closing: "I'll make sure someone on the team gets this right away."

IF the business is currently ON A BREAK (between listed time blocks):
- Greeting: "Thank you for calling [Business Name]. The office is on a short break right now, but I'd be happy to take your information."
- Closing: "Someone will get back to you as soon as they're back."

IF the business is currently CLOSED:
- Greeting: "Thank you for calling [Business Name]. We're currently closed, but I'd be happy to take your information."
- Closing: "We'll get back to you as soon as possible."
```

For a client with a lunch break, just write the hours that way:
```
BUSINESS HOURS:
- Monday-Friday: 8:00 AM - 12:00 PM, 1:00 PM - 5:00 PM (closed 12-1 for lunch)
- Saturday: 9:00 AM - 12:00 PM
- Sunday: CLOSED
```

The AI reads it and handles it. No code needed.

---

## Why This Is Better

| Old approach | New approach |
|---|---|
| Worker checks business hours | AI checks business hours |
| Worker needs client database | Worker just returns the time |
| Google Sheet with 31 columns | Plain English in the prompt |
| New client = add sheet row + configure URL | New client = same URL, hours in prompt |
| Code handles lunch breaks | AI reads "closed 12-1 for lunch" |
| Different URL per client | Same URL for every client |

---

## Common Timezone References for Prompts

Copy the right one into each client's prompt:

**Mountain Time (Wyoming, Colorado, Montana):**
```
TIMEZONE: Mountain Time (UTC-7 MST / UTC-6 MDT during daylight saving, March-November)
```

**Central Time (Texas, Illinois, Wisconsin):**
```
TIMEZONE: Central Time (UTC-6 CST / UTC-5 CDT during daylight saving, March-November)
```

**Eastern Time (New York, Florida, Georgia):**
```
TIMEZONE: Eastern Time (UTC-5 EST / UTC-4 EDT during daylight saving, March-November)
```

**Pacific Time (California, Oregon, Washington):**
```
TIMEZONE: Pacific Time (UTC-8 PST / UTC-7 PDT during daylight saving, March-November)
```

**Arizona (no daylight saving):**
```
TIMEZONE: Arizona Time (UTC-7 year-round, no daylight saving)
```

---

## Testing

- [ ] Visit the Worker URL in browser → Should show current UTC time
- [ ] Call during business hours → AI should NOT say "we're closed"
- [ ] Call during lunch break → AI should say "on a short break"
- [ ] Call after hours → AI should say "we're currently closed"
- [ ] Call on weekend → AI should say "we're currently closed"

---

## Costs

- **Cloudflare Worker:** FREE (100,000 requests/day)
- **Total cost:** $0/month forever
- **New client setup:** 0 extra minutes (just write hours in their prompt like normal)
