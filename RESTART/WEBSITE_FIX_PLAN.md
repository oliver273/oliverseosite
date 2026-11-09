# Website Fix Plan — oliverseo.com

**Problem:** The site reads as a generic AI-generated "digital marketing agency" template. For a business that SELLS web design, the site is the portfolio. Full audit findings below, then the fix order.

---

## Why it looks AI-made (specific to this site)

1. **Dark SaaS template look** — `#020617` background, blue→purple gradient text on every H1, glowing blurred orbs (`hero-glow`), shimmer buttons. This is the default AI landing-page aesthetic in `css/site.css`.
2. **Interchangeable copy** — "Digital Marketing That Drives Results," "Everything Your Business Needs," "Your Growth Partner," "Ready to Grow Your Business?" Any agency anywhere could run these lines.
3. **Agency-plural voice for a solo operator** — "our experienced US-based team," "your account manager," "we have the data, case studies, and testimonials" (no case studies exist on the site).
4. **Placeholder testimonials** — 2 of 3 are anonymous ("Local Business Owner," "Small Business Owner") with identical gradient-initial avatars and five identical star SVGs. The "Testimonials" section heading sits above a stats grid, not testimonials.
5. **Portfolio credibility leak** — 6 of 7 portfolio items link to `*-preview.pages.dev` URLs labeled "View Live Site." Savvy visitors read these as mockups, not shipped client work. Only Water Co. II LLC (waterco2.com, Gillette) is verifiably live.
6. **Identity confusion** — positioned "Nationwide" while the business is Wyoming-focused; no photo of Oliver, no About page, no Gillette anywhere prominent; `404.html` is an entirely different leftover "Oliver AI Services" site with emoji nav linking to pages that don't exist.

## Fix order

### Phase 1 — Honesty and identity (highest credibility impact)
1. Reposition everything Gillette/Wyoming-first: hero, meta titles, footer, contact page. Kill "Now Serving Businesses Nationwide" badge. (`index.html`, `contact.html`, all pages' meta)
2. Rewrite all copy first-person singular: "I build websites for Wyoming businesses" beats fake "our team." Remove "account manager," "US-based team," "3-5x more leads," and the case-studies claim. (`why-us.html`, `services.html`, `index.html`)
3. Add an About page with a real photo of Oliver and 3 sentences about working in Gillette. Link it in the nav on every page.
4. Portfolio honesty: label `pages.dev` items "Concept" and the real ones "Live client site." Lead with Water Co. II LLC. Add Mountain West Farm Bureau (AI receptionist client) as a named case study with Mike's permission. (`portfolio.html`)
5. Replace the two anonymous testimonials with real ones (ask Mike and the Water Co. owner) or delete the section until there are real quotes. (`index.html`)
6. Rebuild `404.html` to match the real site — remove the "Oliver AI Services" leftover with its dead links.

### Phase 2 — De-templating the design
7. One accent color instead of blue→purple→pink gradient text everywhere; remove the glow orbs; vary the card layouts between pages. (`css/site.css`)
8. Fix `portfolio.html` to use the shared `css/site.css` and `js/site.js` instead of its own 125 lines of inline CSS and duplicate menu script.
9. Fix broken links: `portfolio.html` footer points at `/#google-ads`, `/#contact`, `/portfolio.html` — anchors that don't exist on the homepage and inconsistent URL style.
10. Put the phone number `(307) 228-0770` in the header on every page, as a `tel:` link.

### Phase 3 — Offer clarity
11. One AI receptionist price on the site: $1,700/mo and what it includes. Remove the confusing "From $200/mo" line. (`services.html`)
12. Website pricing: show starting prices instead of "Custom Quote" only. (`pricing.html`)
13. Pick one email on the site — `oliver@oliverseo.com` — and use it everywhere (site currently shows `.co`).
14. One concrete proof block on the homepage: Water Co. story — problem, what was built, live link.
15. Sitemap/meta cleanup: add privacy policy to `sitemap.xml`, fix `og:url` on portfolio, refresh stale lastmod dates.

### Done = a visitor can answer three questions in 10 seconds
- Who is this person? (Oliver, Gillette WY, photo, real story)
- Have they done this before? (named, verifiable client work)
- What does it cost? (real numbers, no mystery quotes)
