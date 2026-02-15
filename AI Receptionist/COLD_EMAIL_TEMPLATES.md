# Cold Email Campaign — Instantly.ai Templates

## How to Use
Copy each email into Instantly.ai as a separate step in your sequence.
- **Step 1** = Email 1 (sends immediately)
- **Step 2** = Email 2 (set to send 3 days after Step 1)
- **Step 3** = Email 3 (set to send 5 days after Step 2)

Use Instantly's variable tags: `{{firstName}}`, `{{companyName}}`

---

## STEP 1 — Initial Outreach

**Subject:** Quick question about after-hours calls, {{firstName}}

**Body:**

Hi {{firstName}},

I noticed {{companyName}} likely gets calls outside business hours — and if no one picks up, that's a lost customer.

We built an AI receptionist that answers your phone 24/7, collects the caller's name, number, email, and reason for calling, then sends it to you instantly via email and spreadsheet.

It sounds natural (not robotic), and your callers won't know the difference.

Would you be open to a quick call to hear how it works? I can also set up a demo line you can call yourself.

Best,
Oliver Carroll
OliverSEO — AI Receptionist Services

---

## STEP 2 — Follow-Up (3 days later)

**Subject:** Re: Quick question about after-hours calls, {{firstName}}

**Body:**

Hi {{firstName}},

Just following up — I know you're busy running {{companyName}}.

Here's the short version: our AI answers your phone after hours, collects lead info, and delivers it to your inbox in real-time. No missed calls, no voicemail, no lost revenue.

One of our clients was losing 15+ after-hours calls a month. Now every one of those turns into a follow-up.

Want to hear what it sounds like? I'll send you a number you can call right now.

Best,
Oliver

---

## STEP 3 — Final Follow-Up (5 days later)

**Subject:** Last one from me, {{firstName}}

**Body:**

Hi {{firstName}},

I don't want to fill your inbox — so this is my last note.

If you ever want to stop losing after-hours leads, we have an AI receptionist that handles it for about the cost of a part-time employee — but works 24/7 and never calls in sick.

Here's a demo line you can call anytime to hear it in action: (307) 464-9517

If the timing isn't right, no worries at all. Wishing you and {{companyName}} the best.

Best,
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
