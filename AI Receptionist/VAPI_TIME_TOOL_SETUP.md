# ⏰ Time-Awareness Setup — How the AI Knows the Time

**Purpose:** Give the AI the current time so it knows if the office is open or closed.

**No tools needed. No Cloudflare Worker needed. Uses Vapi's built-in `{{now}}` variable.**

---

## How It Works

Vapi has built-in **dynamic variables** that get injected directly into the system prompt when a call starts. The AI reads the time from its prompt — no tool calls, no external services.

### The Variable

Put this in the system prompt:

```
THE CURRENT TIME IS: {{"now" | date: "%A, %B %d, %Y, %I:%M %p", "America/Denver"}} (Mountain Time)
```

When a call starts, Vapi replaces this with the actual time, like:

```
THE CURRENT TIME IS: Tuesday, February 17, 2026, 12:30 PM (Mountain Time)
```

The AI then compares this to the business hours in the prompt and knows if the office is open, on break, or closed.

---

## For Different Timezones

Just change the timezone string:

| Timezone | Use |
|---|---|
| Mountain Time (Wyoming) | `"America/Denver"` |
| Central Time (Texas) | `"America/Chicago"` |
| Eastern Time (New York) | `"America/New_York"` |
| Pacific Time (California) | `"America/Los_Angeles"` |
| Arizona (no DST) | `"America/Phoenix"` |

### Example for a Central Time client:
```
THE CURRENT TIME IS: {{"now" | date: "%A, %B %d, %Y, %I:%M %p", "America/Chicago"}} (Central Time)
```

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
