# Six Point Auto & Diesel — fictional auto repair sales demo

Created October 26, 2026 for Clinch Valley Digital's "Example Sites". Six Point Auto & Diesel is not a real business.

- Live: https://six-point-auto-demo.vercel.app/
- Private GitHub: https://github.com/KingKhao/six-point-auto-demo
- Vercel project: wkb-projects/six-point-auto-demo, connected to GitHub main.

- Static HTML, CSS and vanilla JavaScript (`index.html`, `styles.css`, `app.js`). No build step, backend, API keys, cookies or storage.
- Search indexing is disabled (`noindex` meta tag and `X-Robots-Tag` header).
- Every flow is a front-end mock. Nothing typed into the page is saved or sent, and each confirmation says so.

## Preview in five lines
1. Open `index.html` in a current browser (or run any static server in this folder).
2. Stay online for the Unsplash photos and the Fontshare font.
3. Tap a symptom in the hero, answer two questions, then press "Get an exact quote".
4. Finish the four-step quote, then scroll to "Is my truck done?" to watch ticket #1042.
5. Resize to phone width: the hero, nav ("Broke down?" and "Get a quote") and every flow have their own phone layout.

## Fictional facts
Six Point Auto & Diesel, 1406 Ridge Line Road, Maynardville, TN 37807 (invented address), (865) 555-0168 (fictional 555 number). Mon–Fri 7:30–5:30, Sat 8–noon, Sun closed. Prices, policies, the towing partner, the financing partner and the 12-month warranty are sample content for a fictional shop. Reviews are labelled on the page as sample reviews written for the demo. No certifications, licenses or awards are claimed.

## Design
The name gives the idea: a six-point socket. The hexagon is the giant hero shape, every photo mask, the ends of every button, the list bullets and the status markers. Light shop-floor off-white and steel grey with one safety-orange accent. Built with the design-taste-frontend skill: direction "One motif" (seed 1036970582), palette taken from the brief instead of the dealt one, pricing section swapped to the list layout because a shop has many priced services, not two plans.

## Features mapped to the brief
| Problem | What the page does |
|---|---|
| Vague, phone-only quotes | Four-step quote (vehicle, service, problem, contact) with validation, a progress bar and a confirmation with a reference number |
| Nobody knows what anything costs | Ten services with price ranges, what's included and how long it takes; payment and financing band |
| No trust signals | "What we work on" tabs, plain-language commitments next to the quote, sample reviews clearly labelled, FAQ |
| Invisible on Google | Semantic headings and real local details show the foundations (demo is deliberately noindex; no ranking claims) |
| Chaotic drop-offs, no status | Ticket lookup with an animated five-step timeline and the matching text messages |
| No maintenance reminders | Reminder calculator from last oil change and oil type, with a mock text preview and on/off switch |
| Fleet work invisible | Fleet tile with benefits and a mock inquiry |
| Payment options unclear | "Ways to pay" band and a financing FAQ |
| No breakdown information | "Broke down?" in the phone nav, step-by-step emergency block with tap-to-call, after-hours FAQ |
| Diagnostic hook | Hero symptom chips into a symptom checker (area, symptom, vehicle) that gives a likely service and price range, labelled as a guide |

## Verification
- Design inspector: 0 fails at 1440, 768 and 390 px. Remaining warnings: 18 font sizes, no video (the only open-licence shop footage found was 1940s film, which doesn't fit), several text start lines.
- Click-through test in Chrome at 1440 and 390 px: 38 of 38 checks pass (all flows, validation, typed HTML shown as text, no form network requests, no script errors, no horizontal overflow).
- Not tested on real phone hardware.
