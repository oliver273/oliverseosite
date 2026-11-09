# OliverSEO — Business Restart Base

**This is the single source of truth for the restart.** Everything useful from a year+ of docs (189 files recovered from git history) is condensed here. The old plans are archive; this file plus the three siblings are the business.

> **SECURITY WARNING:** This repo (`oliver273/oliverseosite`) is **PUBLIC** on GitHub and auto-deploys to oliverseo.com via Cloudflare Pages. Anything committed here — including this file and `.cursorrules` with client details and margins — is readable by anyone. **Either make the repo private (Cloudflare Pages keeps working with private repos) or move these docs to a separate private repo.** Do this before adding anything more sensitive.

**The pack:**
- `00_BASE.md` — this file: identity, accounts, pricing, lessons, the plan
- `SOP_APPOINTMENT_SETTER.md` — appointment setter job (books meetings, doesn't sell)
- `SOP_SALES_CLOSER.md` — salesperson job (runs meetings, closes, doesn't prospect)
- `WEBSITE_FIX_PLAN.md` — de-AI-ing oliverseo.com, prioritized

---

## 1. Who we are

| | |
|---|---|
| Owner | Oliver Carroll |
| Business | OliverSEO — Gillette, Wyoming |
| Offer #1 (growth focus) | AI Receptionist — $1,700/mo flat, 3,000 min included, $0.30/min overage, month-to-month |
| Offer #2 | Web design — Essential $997 / Professional $1,997 / Premium $4,997 |
| Primary email | oliver@oliverseo.com |
| Cold outreach email | outreach@oliverseo.co (Instantly.ai) |
| Business phone | (307) 228-0770 |

## 2. Accounts, links & assets

### Domains & website
| Asset | Detail |
|---|---|
| oliverseo.com | Primary domain — the website |
| oliverseo.co | Secondary — outreach email domain |
| **GitHub repo (edit the website here)** | **https://github.com/oliver273/oliverseosite** |
| Hosting | Cloudflare Pages — connected to the GitHub repo, production branch `main`, no build step, output dir `/`. **Every push to `main` deploys the live site automatically.** |
| Cloudflare dashboard | https://dash.cloudflare.com/ (DNS for both domains + Pages) |
| Contact form | Web3Forms → delivers to oliver@oliverseo.com. Access key `ccdf3061-ccc5-42cd-a0ef-4d3839be4e8f` lives in `js/site.js` (public by design, but regenerate at web3forms.com if spammed) |
| Analytics | Google Analytics 4: `G-2VGKYK0Q0E` (on all pages) |
| Search | Google Search Console + Bing Webmaster, property oliverseo.com; sitemap at /sitemap.xml |

### Money
| Asset | Detail |
|---|---|
| **Square** | Invoicing + payments — squareup.com. Fees: 2.9% + $0.30 card, 1% ACH (capped). Client flow: 50% deposit / 50% on completion for websites; monthly invoice for AI receptionist. Support: 1-855-700-6000 |
| Google Workspace | Email hosting for oliverseo.com (~$6/mo) |

### AI receptionist stack
| Asset | Detail |
|---|---|
| Vapi.ai | The AI phone platform (assistants, numbers, webhooks) |
| LLM / voice | GPT-4.1 nano + ElevenLabs v3 — cost ~$0.11/min all-in, ~1910ms delay |
| Unit economics | ~$330/mo cost per client at 3,000 min → ~$1,370/mo profit per client (81%) |
| Demo line (Claire) | **(307) 464-9517** — the #1 sales tool, prospects call it live |
| HVAC demo line | (307) 439-0773 (used in cold email sequences) |
| Make.com | Vapi webhook → Google Sheets log + real-time lead email |
| Instantly.ai | Cold email sending from outreach@oliverseo.co (30/day, warmup first) |

### Client #1 — Mike (keep him happy, he's the case study)
| | |
|---|---|
| Business | Mountain West Farm Bureau / Farm Bureau Financial Services, Gillette |
| AI line | +1 (307) 439-0626 (after-hours) |
| Lead delivery | KCody@mwfbi.com (Kayleigh, receptionist); office line 307-682-3836 |
| Pricing | Legacy pay-per-use — below the $1,700 list. Referral credit grandfathered at $200 ($500 for new clients) |
| TODO | **Get the testimonial and written case-study permission.** He agreed to referrals already. |

### Social / listings
Google Business Profile (business.google.com — listed as "OliverSEO | AI & Web Solutions"), LinkedIn, Facebook, Reddit (u/OliverSEO). GMB currently lists the demo line (307) 464-9517 as the business phone — reconcile with (307) 228-0770.

## 3. Lessons learned (the expensive ones)

The archive shows ~10 strategy pivots in sequence: Fiverr gigs → Reddit → Hormozi premium pricing → scraped lead lists → Google Maps texting → free-website funnels → commission sales reps → portfolio challenges → AI receptionist → partner referrals. Documented results from all of it: **one web client (~$997, Dec 2024) and one live AI receptionist client (Mike)**. The only hard campaign metric ever logged: 50 cold emails, 0 opens.

**The ten rules for the restart:**
1. **One offer, one channel, one tracking sheet.** The archive has 50+ plan documents and almost no results data. Plans don't compound; weekly numbers do.
2. **Never pivot before measuring.** A channel gets 2 weeks of real activity and a numbers review before it's killed or doubled.
3. **No accountability-free commission reps.** Eli went silent for weeks with zero visibility. Every role now has daily activity logging and a stated trial bar (see the SOPs).
4. **One price list, everywhere.** The docs contain at least 8 conflicting price ladders ($349 to $14,997). The prices in section 1 are THE prices.
5. **Mike is the proof.** Get his testimonial and case study before building any more demo sites. Real beats mockups.
6. **Fix deliverability before buying lists.** $90 of leads died against an unwarmed domain (0/50 opens). Warm up, test 20 sends, then scale.
7. **Local beats national.** The marketing plan itself concluded face-to-face wins in Gillette — then kept buying national HVAC lists. Walk into 5 offices before buying 750 emails.
8. **AI receptionist is the business; web design is the upsell.** It's the only offer with recurring revenue, 81% margins, and a live reference client.
9. **No fantasy-math plans** ($100K/mo docs, 4-day deadlines) until there are 5 paying AI clients ($8,500 MRR) in the bank.
10. **Track the funnel weekly:** touches → conversations → appointments → closes → MRR. If a week has no numbers, the week didn't happen.

## 4. The restart plan

**Team (both roles live simultaneously, separate people, separate SOPs):**
- **Appointment setter** — paid $40/qualified held appointment + $100/close. Minimum 25 touches/day, logged daily. 2-week trial: 10 held appointments.
- **Sales closer** — commission only on cleared payments (30% month 1 + 10% months 2–6 on AI; 25–30% on websites). 30-day trial: 1 close.
- **Oliver** — fulfillment (Vapi setup, website builds), partner relationships, and managing the two reps via the Friday reviews.

**Channel priority:**
1. Gillette partner referrals ($250/signed AI client to accountants, IT/VoIP shops, Chamber, BNI) + Mike's referrals
2. Setter-driven local outreach (calls/walk-ins/DMs with the demo line)
3. Instantly cold email — only after domain warmup proves >20% opens on test sends

**Order of operations:**
1. Make this repo private (or move the docs) — see the warning up top
2. Close out Eli cleanly (reply drafted, $0 owed)
3. Get Mike's testimonial + case-study permission
4. Website Phase 1 fixes (`WEBSITE_FIX_PLAN.md`) — the site must stop undercutting the sales calls
5. Hire the setter first (appointments are the bottleneck), closer once there are 3+ appointments/week to run
6. Weekly funnel review every Friday — numbers or it didn't happen
