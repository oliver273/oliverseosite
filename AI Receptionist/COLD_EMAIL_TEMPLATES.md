# Cold Email Campaign — Instantly.ai Templates

## Current Target: HVAC / Heating & Cooling Businesses

## How to Use
Copy each email into Instantly.ai as a separate step in your sequence.
- **Step 1** = Email 1 (sends immediately)
- **Step 2** = Email 2 (set to send 3 days after Step 1)
- **Step 3** = Email 3 (set to send 6 days after Step 2)

Use Instantly's variable tags: `{{firstName}}`, `{{companyName}}`

---

## STEP 1 — Initial Outreach

**Subject:** {{firstName}} — quick question about {{companyName}}

**Body:**

Hi {{firstName}},

Ever miss a call while you're under someone's crawlspace or up on a roof?

I built an AI that answers your phone 24/7 — it sounds like a real receptionist, talks to the caller, gets their name, number, address, and what's broken, then texts and emails it all to you instantly.

One HVAC owner told me he was losing 3-5 calls a week just during jobs. That's $10,000+ a month walking to competitors.

Want to hear what it sounds like? Call (307) 439-0773 right now — it'll answer as an HVAC company so you can hear exactly what your customers would experience.

Oliver Carroll
AI Receptionist Services
(307) 439-0773

---

## STEP 2 — Follow-Up (3 days later)

**Subject:** re: missed calls {{firstName}}

**Body:**

Hi {{firstName}},

Just following up — 80% of callers won't leave a voicemail. They hang up and call the next company on Google.

My AI receptionist picks up every call, has a real conversation, and sends you the lead info instantly — even at 2am when someone's furnace dies.

Takes 2 minutes to set up on your existing phone line. No new hardware, no apps to download.

Try the live demo: (307) 439-0773

Worth a 10-minute chat this week?

Oliver

---

## STEP 3 — Final Follow-Up (6 days later)

**Subject:** last one {{firstName}}

**Body:**

Hey {{firstName}},

Last email from me — not trying to be annoying.

If missed calls aren't a problem for {{companyName}}, totally ignore this.

But if you've ever lost a job because nobody picked up the phone while your crew was out — that's exactly what I fix. Already running this for businesses and it's working.

Live demo if you're curious: (307) 439-0773

Oliver

---

## Instantly.ai Settings

| Setting | Value |
|---------|-------|
| Daily send limit | 30/day (increase to 40 after 1 week if open rates are above 30%) |
| Delay between emails | 3-5 minutes |
| Send window | Mon-Fri, 7am-10am recipient timezone |
| Track opens | Yes |
| Track link clicks | No (hurts deliverability) |
| Step 1 → Step 2 delay | 3 days |
| Step 2 → Step 3 delay | 6 days |

## Variable Mapping (from your CSV)

| Instantly Variable | CSV Column |
|---|---|
| `{{firstName}}` | First Name |
| `{{lastName}}` | Last Name |
| `{{companyName}}` | Company Name |
| `{{email}}` | Email |
| `{{phone}}` | Phone |
| `{{website}}` | Website |

## Email Signature (in Instantly settings)

```
Oliver Carroll
AI Receptionist Services
(307) 439-0773
```

⚠️ Do NOT include "OliverSEO" in the signature — it confuses HVAC owners.
⚠️ Use the HVAC demo number (307) 439-0773 for HVAC campaigns, NOT the general demo line (307) 464-9517.

## Tips
- Send window is 7am-10am because HVAC owners check email early before heading to jobs
- Don't launch until warmup score is 90%+ (check in Instantly dashboard)
- Start with 30 emails/day — if open rates stay above 30%, bump to 40/day after a week
- Check replies daily — respond within 1 hour if possible
- When they reply, offer a quick 10-minute call to show them the demo and answer questions
- If they call the demo line and then reply to the email — they're HOT. Call them immediately.

## Previous Sequences (Archive)

### Dentist Sequence (paused)
Previously targeted dentists — paused due to HIPAA concerns and lower relevance. Leads were mixed healthcare, not clean dentist lists. Sequence saved below for reference if targeting dentists later.

**Email 1 Subject:** quick question {{firstName}}
**Email 1 Body:** Hi {{firstName}}, Do you ever lose patients because your front desk missed a call? I set up an AI receptionist for a dental office — it answers every call 24/7, books appointments straight into their calendar, and sends the team an instant notification with the caller's info. They stopped losing after-hours patients completely. Want to hear exactly how it sounds? Call (307) 464-9517 right now and it'll answer live. Worth a 10-minute chat? Oliver Carroll, AI Receptionist Services, (307) 464-9517

### General/Insurance Sequence (original — retired)
Original sequence referencing insurance office in Wyoming. Retired because industry-specific messaging converts better.