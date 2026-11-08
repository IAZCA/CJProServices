# CJ Pro Services test website: notes

## Status (2026-11-08)
- Owner picked **Design 1 "Night Shift"** (`design-1-night-shift.html`). Colour rounds: brighter -> then "more white, too blue" + "a little too bright" -> now navy #0a234b alternating with soft-white (#eef1f6) sections for Services, Our work and Service area.
- Owner's feature picks: add Electrical service (kept the other six), add Service area towns. Skipped: reviews, financing, brands, warranty, offers, maintenance plan, emergency line, online booking, FAQ, hours, team photo.
- Service area section (towns by county + small map) was built, then taken OUT at the owner's request ("leave out the map section for now, we'll work on that later"). It's in git history at commit 623c66e. The towns there were a starter list Claude picked, so the owner must confirm them. The electrical scope wording also needs the owner's OK.
- Designs 2 (Blueprint) and 3 (Truck Wrap) are kept for reference only.
- Live: https://iazca.github.io/CJProServices/ (GitHub Pages, public repo IAZCA/CJProServices). Design 1 is now `index.html`; the picker is `designs.html`.
- Local preview: `http://localhost:8418/?motion=on` (the "cjpro-website" preview). The owner's PC has Windows
  animations off, so the page stays still unless `?motion=on` is in the address.
- Photo areas (Installations / Completed jobs) are blank placeholders on purpose. The quote form is not connected.

## Business facts used (from the invoice template)
- CJ PRO SERVICES LLC · Laurel, MD · (301) 379-8609
- EPA, CAMT, CFC certified tech, HVACR · HVACR License #52758 · MHIC License #114256
- Real job on invoice 817: Trane 30,000 BTU heat pump with R-454B (A2L) refrigerant, old system removed, lines brazed, 7.5 kW heater, start-up test.
- The street address on the invoice is left OFF the site on purpose until the owner says it is OK to publish.
- Logo colours: navy `#022351`, orange `#FE5B00` (from `Invoice\cj_pro_logo.png`).

## Copy to confirm with the owner
- Service list: heating repair, AC repair, heat pump installs, system replacement, maintenance, home repair (MHIC).
  The logo has a lightning bolt and a water drop: does CJ Pro also do electrical or plumbing?
- "Written, itemized quote" and "tested before we leave" are taken from how the invoice reads. Confirm.
- Hours, years in business, service towns: unknown, so not on the site.

## Example 1: jdlhvacservices.com (owner: "a good example")
- Top bar with "Call 24/7" phone + social icons; header with menu, "Schedule online" button and a customer login.
- Hero: years-in-business eyebrow, "same-day service" headline, phone button + "Schedule a service" button.
- Trust strip (Angi award, licensed and certified), three big service icons (heating, AC, plumbing) + a call-back form.
- Sections per service with bullet lists; "why homeowners trust us" pillars (local, no upsell, punctual, guarantee, price).
- Credentials list (ACCA, NATE, EPA 608, licensed + insured); Google rating badge (4.8 stars, 700+ reviews).
- Brands named (Carrier, Lennox, Trane, Goodman, Rheem); workmanship warranty; upfront pricing; free replacement estimates.
- Financing page, maintenance plans, 24/7 emergency, military and senior discounts, first-visit offer, special-offers page.
- Long county-by-county service-area list; blog; careers; "we accept all major credit cards"; scroll-to-top.
- Weak spots: hours contradict (24/7 vs Mon-Fri 7-5), "since 2012" vs "20+ years", repetitive copy, very long town list.

## Example 2: heatingandcoolinginc.com (owner: "somewhat good, but too much white, it blinds me")
- **Owner dislikes the large bright white areas. Keep CJ Pro's site off pure white.**
- Header: Lennox dealer badge, Offers + Financing links, phone, "Request service" button; mobile bar with Call + Request.
- Hero with two CTAs: Request service + Learn about financing.
- Promo cards (air-quality article, manufacturer rebate offer, "Leave a review").
- Specific proof: since 1969, average tech tenure 14 years, NATE certified, BBB A+, local "best of" award.
- Rebate card with concrete numbers (up to $1,800 or 60 months no interest), certification logo row, blog teasers.
- Town list + town-by-service links (SEO), testimonials page, FAQ, careers, "Review us".
- Weak spots: lots of white with placeholder images, phone button repeated about six times, generic hero copy, no pricing.

## General research (HVAC website guides, 2026; vendor blogs, so treat numbers as rough)
- Phone + booking visible at all times; sticky click-to-call on phones (built in: bottom call bar).
- Fast load (under ~3 s); answer "what, where, how to reach you" in seconds.
- Reviews and real job photos beat stock photos; some pricing guidance helps; financing; service-area pages for local search.
- Sources: fieldpromax.com/blog/top-hvac-websites-for-your-brand, simprogroup.com/blog/hvac-websites,
  hookagency.com/hvac-websites/, pxlpeak.com/blog/web-design/best-hvac-website-designs-2026

## Movement built in (all designs share `assets/site.js`)
- Eased smooth scroll for menu links (stops if you touch or scroll), header tucks away on scroll down and comes back on scroll up,
  sliding underline under the current section, orange scroll progress bar, sections fade/slide in as they arrive,
  slide-in phone menu, sliding tab pill for the photo tabs, back-to-top button, card hover lift + glow (mouse only).
- Respects "reduce motion" settings; `?motion=on` forces it, `?motion=off` turns it off.

## Files
- `assets/logo-color.png`, `logo-reverse.png` (navy turned white for dark backgrounds), `lockup-*.png` (sideways header logo),
  `mark-*.png` (house emblem only), `favicon.png`. All cut from `Invoice\cj_pro_logo.png`.
