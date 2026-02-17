# ⏰ Time-Awareness Setup — How the AI Knows the Time

**Purpose:** Give the AI the current time so it knows if the office is open or closed.

**No tools needed. No Cloudflare Worker needed. Uses Vapi's built-in `{{now}}` variable.**

---

## How It Works

Vapi has built-in **dynamic variables** that get injected directly into the system prompt when a call starts. The AI reads the time from its prompt — no tool calls, no external services.

### The Variable

Put this in the system prompt:

```
CURRENT UTC TIME: {{now}}
Mountain Time = UTC minus 7 hours (MST winter) or UTC minus 6 hours (MDT summer, March-November).
```

When a call starts, Vapi replaces `{{now}}` with the actual UTC time. The AI then:
1. Subtracts 7 hours to get Mountain Time
2. Compares to business hours in the prompt
3. Determines if office is open, on break, or closed

Example: If `{{now}}` shows 7:43 PM UTC → that's 12:43 PM Mountain Time → office is OPEN.

---

## For Different Timezones

Just change the UTC offset instruction in the prompt:

| Timezone | Instruction |
|---|---|
| Mountain Time (Wyoming) | "Subtract 7 hours from UTC (MST) or 6 hours (MDT Mar-Nov)" |
| Central Time (Texas) | "Subtract 6 hours from UTC (CST) or 5 hours (CDT Mar-Nov)" |
| Eastern Time (New York) | "Subtract 5 hours from UTC (EST) or 4 hours (EDT Mar-Nov)" |
| Pacific Time (California) | "Subtract 8 hours from UTC (PST) or 7 hours (PDT Mar-Nov)" |
| Arizona (no DST) | "Subtract 7 hours from UTC year-round" |

---

## What Changed (Old → New)

| Old approach | New approach |
|---|---|
| Cloudflare Worker returned the time | Vapi injects time automatically |
| AI called a tool every turn (broken) | No tools — time is in the prompt |
| Tool fired 4-7 times per call | Zero tool calls |
| AI got confused and skipped steps | AI reads time once, follows script |
| Required Cloudflare account | Nothing extra needed |
| Cost: $0/mo (but required setup) | Cost: $0/mo (zero setup) |

---

## Setup Steps (Per Client)

1. **Remove the `check_current_time` tool** from the Vapi assistant (if it exists)
2. **Add the `{{now}}` variable** to the system prompt (see AI_RECEPTIONIST_PROMPT.md)
3. **Add business hours** to the prompt in plain English
4. **Done.** The AI handles everything.

---

## Daylight Saving Time

Handled automatically. The `"America/Denver"` timezone string accounts for MST (winter) and MDT (summer). You never need to change it.

---

## The Old Cloudflare Worker

The `get-current-time` Cloudflare Worker is **no longer needed**. You can delete it from your Cloudflare dashboard, or just leave it — it won't cost anything and won't be called.

---

## Testing

- [ ] Make a test call during business hours → AI should NOT say "we're closed"
- [ ] Make a test call after hours → AI should say "the office is closed for the day"
- [ ] Make a test call on weekend → AI should say "the office is closed"
- [ ] Verify: NO "Tool Response" entries in the call log
- [ ] Verify: AI follows the full script without skipping steps

---

## Costs

- **$0/month.** Built into Vapi. No external services needed.
