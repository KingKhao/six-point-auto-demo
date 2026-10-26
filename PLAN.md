# Auto repair showpiece demo: build plan (paused 2026-10-26)

Kevin's brief: the "ChatGPT Prompt — Showpiece Auto Repair Demo Site" he pasted on 2026-10-26 (build it here, not in ChatGPT),
then publish to a private GitHub repo + Vercel, same as signal-three-barbershop-demo
(static HTML/CSS/JS, vercel.json with X-Robots-Tag noindex, .vercelignore for *.md, README with fictional facts + feature map, CREDITS.md).

## Decisions so far
- Business (fictional): **Six Point Auto & Diesel**, invented address on an invented road in Maynardville TN. General repair + trucks + diesel + farm equipment.
  Folder: Projects/six-point-auto-demo.
- Design skill: design-taste-frontend. Direction dealt: **One motif** (seed 1036970582, .taste-skill/direction.json).
- Idea: the name's **six-point socket / hex nut** becomes the one motif: giant cropped hex in the hero, photo masks,
  the button shape, list bullets, one full-width band.
- Palette: the brief fixes it (off-white + steel grey + one safety-orange accent), overriding the dealt burgundy palette (redraw reason: brand constraint).
- Type: dealt Pilcrow Rounded (Fontshare); sentence case, not all-lowercase.
- Live thing: the symptom checker (area, then 2-3 questions, then likely service + price range + "Get an exact quote"), plus the #1042 repair-status timeline.
- Photos: Unsplash auto-shop URLs (the brief asks for them), credited in CREDITS.md.

## Left to do
Copy deck, build index.html/styles.css/app.js, run lint + inspect at 1440/768/390, publish (gh repo create --private, vercel), then add it
as a "Demo site" in CVD /admin if Kevin wants.
