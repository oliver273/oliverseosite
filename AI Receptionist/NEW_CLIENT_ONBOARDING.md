# New Client Onboarding Checklist

> Use this every time you sign a new client. Follow it step by step so nothing gets missed.

---

## PHASE 1: CLOSE THE DEAL (Day 1)

- [ ] Client says yes on the call or via email
- [ ] Send the **Service Agreement** for signature (copy from `SERVICE_AGREEMENT_MIKE.md` as a template, update client details)
- [ ] Confirm which **plan** the client wants:
  - **Pay-Per-Use:** $0.90/min + $1,500 setup fee (3-month minimum, then month-to-month)
  - **Pro:** $1,700/mo flat + $0.30/min overage (no setup fee)
- [ ] Set up invoice in Square:
  - Pay-Per-Use: $1,500 setup invoice immediately, then monthly usage invoices
  - Pro: Recurring $1,700 on the 1st of each month
- [ ] Decide on start date — pro-rate first month or start on the 1st?

---

## PHASE 2: COLLECT CLIENT INFO (Day 1-2)

Get ALL of this from the client before building anything:

### Business Info
- [ ] Business name (full legal name)
- [ ] Business type (insurance, real estate, law, medical, etc.)
- [ ] Business address
- [ ] Business hours (when are they open vs when the AI takes over?)
- [ ] Brief description of services they offer

### Contact Info
- [ ] Client name (the decision maker)
- [ ] Client email
- [ ] Client phone number

### AI Setup Info
- [ ] **Notification email(s)** — where should call summaries be sent?
- [ ] **Greeting style** — professional, friendly, or casual?
- [ ] **What info to collect from callers** — name, phone, email, reason? Anything extra?
- [ ] **Any specific questions** the AI should ask? (e.g., "Are you a current client?", "Is this urgent?")
- [ ] **Business-specific terms** the AI needs to know (e.g., policy types for insurance, property types for real estate)
- [ ] **Common caller scenarios** — what do most people call about?

### Phone Setup Info
- [ ] **Their current phone system** — who's their provider? (helps with forwarding setup)
- [ ] **When to forward calls** — after hours only? All the time? When no one answers?
- [ ] **Forwarding method** — do they know how to set up call forwarding? (be ready to walk them through it)

---

## PHASE 3: BUILD THE AI (Day 2-4)

- [ ] Create a **new Vapi.ai assistant** for this client
- [ ] Write a **custom AI prompt** based on their business info (use `AI_RECEPTIONIST_PROMPT.md` as a template)
- [ ] Write a **custom call script** (use `CALL_SCRIPT.md` as a template)
- [ ] Set the **LLM** — GPT-4.1 nano (default)
- [ ] Set the **voice** — ElevenLabs v3 (default)
- [ ] Get a **dedicated phone number** for the client from Vapi
- [ ] Set up **email notifications** to the client's designated email(s)
- [ ] Set up **Google Sheets integration** for the call log
- [ ] Share the Google Sheets call log with the client

---

## PHASE 4: TEST (Day 4-5)

- [ ] **You test it first** — make 3-5 test calls yourself
  - [ ] Test normal call (give name, phone, email, reason)
  - [ ] Test edge cases (unusual name spelling, long email, no email)
  - [ ] Test the greeting and tone
  - [ ] Verify email notifications arrive correctly
  - [ ] Verify Google Sheets updates correctly
  - [ ] Check transcript accuracy
- [ ] **Fix any issues** before the client ever hears it
- [ ] **Send the client their AI phone number** and ask them to test it
- [ ] **Get client feedback** — anything to change? Tone? Greeting? Questions?
- [ ] **Make adjustments** based on feedback (same day)
- [ ] **Client confirms they're happy** with how it sounds

---

## PHASE 5: GO LIVE (Day 5-7)

- [ ] **Help the client set up call forwarding** from their business line to the AI number
  - Walk them through their phone provider's forwarding settings (see provider guides below)
  - Test that forwarding works correctly

### Call Forwarding Guides by Provider

#### Spectrum Business

**Turn ON forwarding (send calls to the AI):**
1. Turn off Day/Night mode on the phone system
2. Pick up the phone, press **Line 1**, then dial **\*72** — wait for the beep
3. Dial the AI's phone number (e.g. 307-439-0626), wait for the confirmation message — done

**Turn OFF forwarding (back to normal):**
1. Pick up the phone, press **Line 1**
2. Dial **\*73**, listen for the confirmation message — done

#### Other Providers
*(Add guides here as you onboard clients with different phone systems)*

- **AT&T / Verizon / T-Mobile (cell):** Dial \*72 + AI number to forward, \*73 to cancel (same as Spectrum for most)
- **RingCentral:** Admin Portal → Phone System → Call Handling → Add Forwarding Number
- **Google Voice:** Settings → Calls → Call Forwarding → Add AI number
- **Vonage:** Dashboard → Extensions → Call Forwarding → Enter AI number
- [ ] **Confirm first real call comes through** — monitor it closely
- [ ] **Send the client a "you're live" email:**

> Subject: Your AI Receptionist Is Live!
>
> Hey [Name],
>
> Your AI receptionist is live and answering calls! Here's everything you need:
>
> **AI Phone Number:** [number]
> **Call notifications going to:** [email(s)]
> **Call log spreadsheet:** [Google Sheets link]
>
> I'll be monitoring everything closely this first week to make sure it's running perfectly. If you notice anything you want changed, just text or email me and I'll handle it same-day.
>
> Talk soon,
> Oliver

---

## PHASE 6: FIRST WEEK MONITORING (Week 1)

- [ ] **Monitor every call** that comes through for the first 5-7 days
- [ ] **Send daily check-in** (quick text or email): "Hey [Name], X calls came through today, all captured perfectly."
- [ ] **Fix any issues immediately** — don't wait for them to find problems
- [ ] **Proactively suggest improvements** if you notice anything: "I noticed a lot of callers are asking about [X], want me to add that to what the AI collects?"
- [ ] **End-of-week check-in call/text:** "How's everything feeling? Anything you'd want different?"

---

## PHASE 7: LOCK IN HAPPINESS (Week 2-3)

- [ ] **Send a recap email** with stats (calls handled, leads captured)
- [ ] **Ask for feedback** — what do they love? What could be better?
- [ ] **Implement any changes** same-day
- [ ] **Ask for a testimonial** — "Would you mind if I mentioned you as a reference?"
- [ ] **Plant the referral seed** — "If you know anyone who deals with after-hours calls, I'll knock $500 off your next invoice for every referral that signs up."

---

## PHASE 8: ONGOING (Monthly)

- [ ] **Week 1:** Review call data, fix any issues, optimize prompt
- [ ] **Week 2:** Send monthly recap email with stats
- [ ] **Week 3:** Ask if they want any changes
- [ ] **Week 4:** Casually remind about the referral program
- [ ] **Send invoice** on the 1st via Square
- [ ] **Check for overage** — if they're approaching 3,000 minutes, give them a heads up

---

## TIMELINE SUMMARY

| Day | What Happens |
|-----|-------------|
| Day 1 | Deal closed, agreement signed, info collected |
| Day 2-4 | AI built, prompt written, phone number assigned |
| Day 4-5 | Testing (you first, then client) |
| Day 5-7 | Go live, call forwarding set up |
| Week 1 | Monitor every call, daily updates |
| Week 2-3 | Get feedback, ask for testimonial, plant referral seed |
| Monthly | Optimize, recap email, invoice, referral reminder |

---

## WHAT YOU NEED READY BEFORE EACH NEW CLIENT

1. ✅ Service Agreement template (have it ready to customize)
2. ✅ Square invoice set up
3. ✅ Vapi.ai account with capacity for new assistants
4. ✅ Google Sheets template for call logs
5. ✅ Email notification system configured
6. ✅ AI prompt template (`AI_RECEPTIONIST_PROMPT.md`)
7. ✅ Call script template (`CALL_SCRIPT.md`)
8. ✅ "You're Live" email template (above)
9. ✅ Monthly recap email template (in `MARKETING_PLAN.md`)

---

*Time to onboard a new client: ~5-7 days from signed agreement to live*  
*Your time investment: ~3-5 hours total per new client setup*
