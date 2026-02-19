# Cold Email Campaign — Instantly.ai Templates

## How to Use
Copy each email into Instantly.ai as a separate step in your sequence.
- **Step 1** = Email 1 (sends immediately)
- **Step 2** = Email 2 (set to send 3 days after Step 1)
- **Step 3** = Email 3 (set to send 5 days after Step 2)

Use Instantly's variable tags: `{{firstName}}`, `{{companyName}}`

---

## STEP 1 — Initial Outreach

**Subject:** {{firstName}} — quick question

**Body:**

Hi {{firstName}},

Do you guys ever miss calls after hours at {{companyName}}?

I set up an AI receptionist for an insurance office here in Wyoming — it picks up every call they miss, collects the caller's info, can even book appointments, and emails everything to their team instantly.

Want to hear what it sounds like? You can call it right now: (307) 464-9517

Oliver

Best,
Oliver Carroll
OliverSEO — AI Receptionist Services

---

## STEP 2 — Follow-Up (3 days later)

**Subject:** Re: {{firstName}} — quick question

**Body:**

Hi {{firstName}},

Just bumping this up. 80% of callers won't leave a voicemail — they just hang up and call someone else.

If you want to hear what the AI receptionist sounds like, call this number: (307) 464-9517

Takes 30 seconds.

Oliver

---

## STEP 3 — Final Follow-Up (5 days later)

**Subject:** not trying to spam you {{firstName}}

**Body:**

Hey {{firstName}},

Last email from me. If after-hours calls aren't a problem for {{companyName}}, totally ignore this.

But if you're losing leads to voicemail, I built something that fixes it. Already running it for a business here in Wyoming.

Demo line if you're curious: (307) 464-9517

Oliver

---

## Instantly.ai Settings

| Setting | Value |
|---------|-------|
| Daily send limit | 30/day (increase to 50 after 1 week) |
| Delay between emails | 3-5 minutes |
| Send window | Mon-Fri, 8am-11am recipient timezone |
| Track opens | Yes |
| Track link clicks | No (hurts deliverability) |
| Step 1 → Step 2 delay | 3 days |
| Step 2 → Step 3 delay | 5 days |

## Variable Mapping (from your CSV)

| Instantly Variable | CSV Column |
|---|---|
| `{{firstName}}` | First Name |
| `{{lastName}}` | Last Name |
| `{{companyName}}` | Company Name |
| `{{email}}` | Email |
| `{{phone}}` | Phone |
| `{{website}}` | Website |

## Tips
- Add your demo phone number to Email 3 before launching
- Don't launch until warmup score is 90%+ (check in Instantly dashboard)
- Start with 30 emails/day — if open rates stay above 50%, bump to 50/day after a week
- Check replies daily — respond within 1 hour if possible
