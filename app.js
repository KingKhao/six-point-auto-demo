// Six Point Auto & Diesel demo: every flow here is a front-end mock. Nothing is stored or sent anywhere.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = ms => new Promise(r => setTimeout(r, reduced ? 0 : ms));

  // ---------- nav and entrances ----------
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  $$("[data-in]").forEach(el => io.observe(el));

  // ---------- symptom checker ----------
  const VEHICLE = { q: "What are you driving?", a: ["Car or SUV", "Pickup", "Diesel truck", "Farm equipment"] };
  const AREAS = {
    noise: { name: "Strange noise", q: "When do you hear it?", a: {
      "When braking": ["Brake pads and rotors", 180, 420, "1.5 to 2.5 hours", "A squeal usually means the wear indicators are touching; grinding means metal on metal. Don't wait on grinding."],
      "When turning": ["CV axle or steering linkage", 220, 480, "1 to 3 hours", "A clicking on tight turns is the classic worn CV joint."],
      "Over bumps": ["Suspension: struts, links or bushings", 250, 700, "2 to 4 hours", "Clunks over bumps are usually a worn sway bar link or strut mount."],
      "All the time, louder with speed": ["Wheel bearing or exhaust", 220, 520, "1 to 2 hours", "Do not perform driving tests to diagnose this. A technician can inspect the wheel bearings and exhaust; stop driving and arrange help if handling feels unsafe."] } },
    brakes: { name: "Brakes", q: "What are the brakes doing?", a: {
      "Squealing or grinding": ["Brake pads and rotors", 180, 420, "1.5 to 2.5 hours", "Grinding can ruin rotors fast. The sooner, the cheaper."],
      "Pedal feels soft": ["Brake fluid or hydraulic repair", 120, 450, "1 to 2 hours", "A soft or sinking pedal can be a leak. Drive it as little as possible.", true],
      "Pulls when I brake": ["Sticking caliper", 220, 480, "1.5 to 2 hours", "One side doing more work than the other is usually a caliper or hose."],
      "Brake light is on": ["Brake system inspection", 65, 180, "About 45 minutes", "Could be low fluid, worn pads or a sensor. We check before we charge for parts."] } },
    engine: { name: "Engine light", q: "Is the light steady or flashing?", a: {
      "Steady": ["Code read and diagnostic", 95, 95, "About 1 hour", "Steady usually means drive it in soon, not tonight. The $95 comes off the repair."],
      "Flashing": ["Misfire: plugs or ignition coils", 150, 450, "1 to 2 hours", "A flashing light means a misfire that can damage the catalytic converter. Stop driving it and call us for a tow.", true],
      "On, and it's running rough": ["Misfire or vacuum leak diagnostic", 95, 400, "1 to 2 hours", "Rough running with the light on is usually ignition or a vacuum leak."],
      "On, and it's lost power": ["Limp mode diagnostic", 95, 600, "1 to 3 hours", "Diesels often drop power for DEF, EGR or turbo faults. We test before we guess."] } },
    leak: { name: "Leak", q: "What color is it?", a: {
      "Brown or black": ["Oil leak: gasket or seal", 150, 650, "1 to 4 hours", "Valve cover and oil pan gaskets are the usual suspects, and the cheaper end of the range."],
      "Green, orange or pink": ["Coolant leak", 180, 600, "1 to 3 hours", "Watch the temperature gauge. Overheating turns a $200 hose into a head gasket.", true],
      "Red": ["Transmission or power steering leak", 150, 500, "1 to 3 hours", "Red fluid is transmission or power steering. Both are cheaper caught early."],
      "Clear, like water": ["Probably A/C condensation", 0, 0, "No charge to look", "Clear water under the passenger side after running the A/C is normal. Bring it by and we'll confirm for free."] } },
    steering: { name: "Steering", q: "What's the steering doing?", a: {
      "Pulls to one side": ["Alignment", 95, 140, "About 1 hour", "Check tire pressures first. If they're even, it's almost always alignment."],
      "Shakes at highway speed": ["Tire balance", 60, 100, "About 45 minutes", "A shake at 55 to 70 is usually balance; a shake when braking is rotors."],
      "Hard to turn": ["Power steering repair", 150, 650, "1 to 3 hours", "Often a pump, a belt or low fluid. Cheapest when it's the belt."],
      "Wheel sits crooked": ["Alignment", 95, 140, "About 1 hour", "A crooked wheel after hitting a pothole can also mean a bent part; we check."] } },
    start: { name: "Won't start", q: "What happens when you turn the key?", a: {
      "Clicks": ["Battery or starter", 160, 550, "30 minutes to 2 hours", "A single click is often the starter; rapid clicking is a weak battery. Battery tests are free."],
      "Cranks but won't fire": ["Fuel or ignition diagnostic", 95, 900, "1 to 3 hours", "Cranks fine but won't catch is fuel, spark or a sensor. We test before quoting the repair."],
      "Nothing at all": ["Battery, cables or connections", 150, 300, "About 1 hour", "Dead silence is usually the battery or a loose cable. Try a jump; if it starts, come by for a free test."],
      "Starts, then dies": ["Idle or fuel delivery diagnostic", 95, 500, "1 to 2 hours", "Often a fuel pump, an idle valve or a security key issue."] } },
  };
  const VEH_MULT = { "Car or SUV": 1, "Pickup": 1.15, "Diesel truck": 1.4, "Farm equipment": 1.5 };
  const tool = $("#tool-body"), bars = $$(".tool-progress span"), scan = $("#scan");
  let pick = {};
  const progress = n => bars.forEach((b, i) => b.classList.toggle("on", i < n));
  const chips = (opts, attr, title) => `<div class="tool-step"><h3>${esc(title)}</h3><div class="chips" role="group" aria-label="${esc(title)}">${opts.map(o =>
    `<button type="button" class="chip" aria-pressed="false" data-${attr}="${esc(o)}"><span class="hexdot" aria-hidden="true"></span>${esc(o)}</button>`).join("")}</div></div>`;
  const back = () => `<button type="button" class="link back" data-back>Start over</button>`;
  const money = n => "$" + Math.round(n / 5) * 5;

  function showAreas() {
    pick = {}; progress(1);
    tool.innerHTML = chips(Object.values(AREAS).map(a => a.name), "area", "Where's the problem?");
  }
  function showQ1() {
    const a = AREAS[pick.area]; progress(2);
    tool.innerHTML = chips(Object.keys(a.a), "ans", a.q) + back();
    $(".chip", tool)?.focus({ preventScroll: true });
  }
  function showQ2() {
    progress(3);
    tool.innerHTML = chips(VEHICLE.a, "veh", VEHICLE.q) + back();
    $(".chip", tool)?.focus({ preventScroll: true });
  }
  async function showResult() {
    progress(4);
    tool.innerHTML = `<p class="scanning"><span class="hexdot" aria-hidden="true"></span>Checking ${esc(AREAS[pick.area].name.toLowerCase())} symptoms…</p>`;
    scan.classList.remove("run"); void scan.offsetWidth; scan.classList.add("run");
    await wait(900);
    const [service, lo, hi, time, note, urgent] = AREAS[pick.area].a[pick.ans];
    const m = VEH_MULT[pick.veh] || 1;
    const price = hi === 0 ? "No charge to check" : lo === hi ? money(lo) : `${money(lo * m)}–${money(hi * m)}`;
    tool.innerHTML = `<div class="tool-step result">
      <p>Most likely, based on what you told us:</p>
      <h3>${esc(service)}</h3>
      <p class="result-price">${esc(price)}</p>
      <dl><dt>Vehicle</dt><dd>${esc(pick.veh)}</dd><dt>Usual time</dt><dd>${esc(time)}</dd><dt>Symptom</dt><dd>${esc(AREAS[pick.area].name)}: ${esc(pick.ans.toLowerCase())}</dd></dl>
      <p>${esc(note)}</p>
      ${urgent ? `<p class="warn">Don't keep driving on this one. Call (865) 555-0168 and we'll arrange a tow.</p>` : ""}
      <div class="actions"><a class="btn" href="#quote" data-quote>Get an exact quote</a>${back()}</div>
      <p class="note">This is a guide based on common causes, not a diagnosis or a guaranteed price. Demo prices for a fictional shop.</p></div>`;
    $(".result h3", tool).setAttribute("tabindex", "-1"); $(".result h3", tool).focus({ preventScroll: true });
  }
  tool.addEventListener("click", e => {
    const b = e.target.closest("button, a"); if (!b) return;
    if (b.dataset.area) { pick.area = Object.keys(AREAS).find(k => AREAS[k].name === b.dataset.area); press(b); setTimeout(showQ1, reduced ? 0 : 160); }
    else if (b.dataset.ans) { pick.ans = b.dataset.ans; press(b); setTimeout(showQ2, reduced ? 0 : 160); }
    else if (b.dataset.veh) { pick.veh = b.dataset.veh; press(b); setTimeout(showResult, reduced ? 0 : 160); }
    else if ("back" in b.dataset) showAreas();
    else if ("quote" in b.dataset) prefillQuote(AREAS[pick.area].a[pick.ans][0], `${AREAS[pick.area].name}: ${pick.ans.toLowerCase()}. Symptom guide suggested ${AREAS[pick.area].a[pick.ans][0].toLowerCase()}.`, pick.veh);
  });
  const press = b => $$(".chip", b.parentElement).forEach(c => c.setAttribute("aria-pressed", String(c === b)));
  showAreas();
  $$("[data-start]").forEach(b => b.addEventListener("click", () => {
    pick = { area: b.dataset.start }; showQ1();
    $("#checker").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }));

  // ---------- quote flow ----------
  const form = $("#quote-form"), panes = $$(".pane", form), stepBars = $$("#steps-bar div");
  const next = $("#q-next"), backBtn = $("#q-back"), err = $("#q-err");
  const LABELS = ["Next: service", "Next: the problem", "Next: contact", "Send request"];
  let step = 0;
  const choice = { soon: "This week", reach: "Text" };
  function go(n) {
    step = n; err.textContent = "";
    panes.forEach((p, i) => { p.hidden = i !== n; });
    stepBars.forEach((b, i) => { b.classList.toggle("on", i < n); b.classList.toggle("now", i === n); });
    next.textContent = LABELS[n]; backBtn.hidden = n === 0;
  }
  function valid() {
    const p = panes[step];
    for (const f of $$("input[required], select[required], textarea[required]", p)) {
      const v = f.value.trim();
      let bad = !v;
      if (f.id === "q-year" && v) bad = !(+v >= 1960 && +v <= 2027);
      if (f.id === "q-phone" && v) bad = v.replace(/\D/g, "").length < 10;
      if (bad) {
        const name = $(`label[for="${f.id}"]`).textContent;
        err.textContent = f.id === "q-phone" && v ? "Enter a 10-digit phone number." : f.id === "q-year" && v ? "Enter a year between 1960 and 2027." : `Please fill in ${name.toLowerCase()}.`;
        f.focus(); return false;
      }
    }
    return true;
  }
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!valid()) return;
    if (step < 3) { go(step + 1); $("input, select, textarea", panes[step])?.focus(); return; }
    // Demo: build a confirmation from what's on the page; no request is made.
    const v = id => $(id).value.trim();
    const ref = "SP-" + (1043 + Math.floor(Math.random() * 900));
    stepBars.forEach(b => { b.classList.add("on"); b.classList.remove("now"); });
    form.hidden = true;
    const done = $("#quote-done"); done.hidden = false;
    done.innerHTML = `<div class="confirm" tabindex="-1">
      <p>Thanks, ${esc(v("#q-name").split(" ")[0])}. Your request number is</p>
      <p class="ref">${ref}</p>
      <p>${esc(v("#q-year"))} ${esc(v("#q-make"))} ${esc(v("#q-model"))} · ${esc(v("#q-service"))} · ${esc(choice.soon.toLowerCase())}</p>
      <ul class="checklist">
        <li><span class="tick" aria-hidden="true"></span>Request received</li>
        <li><span class="tick" aria-hidden="true"></span>A tech reviews it and prices the likely repair</li>
        <li><span class="tick" aria-hidden="true"></span>We ${choice.reach === "Text" ? "text" : "call"} you at ${esc(v("#q-phone"))} within two business hours</li>
      </ul>
      <p class="demo-note">Demo: nothing was saved or sent. On a real shop's site this request would reach the shop by text and email.</p>
      <p style="margin-top:18px"><button type="button" class="link" id="q-again" style="color:inherit">Start another quote</button></p></div>`;
    $(".confirm", done).focus();
    for (const li of $$(".checklist li", done)) { await wait(380); li.classList.add("done"); }
    $("#q-again").addEventListener("click", () => { form.reset(); form.hidden = false; done.hidden = true; go(0); $("#q-year").focus(); });
  });
  backBtn.addEventListener("click", () => go(step - 1));
  form.addEventListener("click", e => {
    const b = e.target.closest("[data-soon], [data-reach]"); if (!b) return;
    const key = b.dataset.soon ? "soon" : "reach"; choice[key] = b.dataset[key];
    $$(".chip", b.parentElement).forEach(c => { const on = c === b; c.setAttribute("aria-checked", on); c.setAttribute("aria-pressed", on); });
  });
  function prefillQuote(service, desc, veh) {
    const sel = $("#q-service");
    const map = { "Brake": "Brakes", "Alignment": "Tires and alignment", "Tire": "Tires and alignment", "Battery": "Battery, starting and charging",
      "Oil": "Leak", "Coolant": "Leak", "Transmission": "Leak", "Suspension": "Suspension and steering", "CV": "Suspension and steering", "Power steering": "Suspension and steering" };
    const hit = Object.keys(map).find(k => service.startsWith(k));
    sel.value = hit ? map[hit] : veh === "Diesel truck" ? "Diesel service" : veh === "Farm equipment" ? "Farm equipment" : "Diagnostics / check engine light";
    $("#q-desc").value = desc;
  }
  $$("[data-service]").forEach(a => a.addEventListener("click", () => { $("#q-service").value = a.dataset.service; }));
  go(0);

  // ---------- what we work on ----------
  const WORKS = [
    ["Cars and SUVs", "Domestic and import, from the commuter to the family hauler. Same-day oil, brakes and diagnostics most weekdays.", "photo-1541899481282-d53bffe3c35d", "A blue hatchback parked on a street"],
    ["Pickups", "Half-ton to one-ton, gas or diesel. Lift kits, towing packages and the work trucks that never get a day off.", "photo-1533473359331-0135ef1b58bf", "A white full-size SUV on a dirt road below red rocks"],
    ["Diesel", "Power Stroke, Duramax and Cummins. Injectors, turbos, glow plugs, EGR and DEF, tested before we quote the fix.", "photo-1625047509248-ec889cbff17f", "A mechanic working in the engine bay of a vehicle with the hood up"],
    ["Farm equipment", "Tractors and farm trucks between seasons or in the middle of one. Ask about bringing it in on a trailer.", "photo-1530267981375-f0de937f5f13", "A green tractor working in a field"],
  ];
  const wImg = $("#works-img");
  $$("[data-work]").forEach(b => b.addEventListener("click", () => {
    const [t, txt, id, alt] = WORKS[+b.dataset.work];
    $("#vehicle-panel").setAttribute("aria-labelledby", b.id);
    $$("[data-work]").forEach(x => { x.setAttribute("aria-selected", String(x === b)); x.tabIndex = x === b ? 0 : -1; });
    wImg.classList.add("out");
    setTimeout(() => {
      wImg.src = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&h=950&q=70`; wImg.alt = alt;
      $("#works-title").textContent = t; $("#works-text").textContent = txt;
      wImg.onload = () => wImg.classList.remove("out");
      if (wImg.complete) wImg.classList.remove("out");
    }, reduced ? 0 : 260);
  }));
  const workTabs = $$("[data-work]");
  workTabs.forEach((button, index) => {
    button.tabIndex = index === 0 ? 0 : -1;
    button.addEventListener("keydown", event => {
      const key = event.key;
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;
      event.preventDefault();
      const target = key === "Home" ? 0 : key === "End" ? workTabs.length - 1 : (index + (key === "ArrowRight" ? 1 : -1) + workTabs.length) % workTabs.length;
      workTabs[target].focus(); workTabs[target].click();
    });
  });
  WORKS.forEach(w => { const i = new Image(); i.src = `https://images.unsplash.com/${w[2]}?auto=format&fit=crop&w=1100&h=950&q=70`; });

  // ---------- repair status ----------
  const tl = $$("#timeline li"), bubbles = $$(".status-phone .bubble");
  const TIMES = ["Mon 7:42 a.m.", "Mon 9:15 a.m.", "Mon 9:31 a.m.", "Mon 1:10 p.m.", "Mon 3:48 p.m."];
  let running = 0;
  async function track() {
    const id = ++running;
    tl.forEach(li => { li.className = ""; $("time", li).textContent = ""; });
    bubbles.forEach(b => b.classList.remove("show"));
    $("#ticket-meta").textContent = "";
    for (let i = 0; i < tl.length; i++) {
      await wait(i ? 650 : 200); if (id !== running) return;
      if (i) tl[i - 1].className = "done";
      tl[i].className = i === tl.length - 1 ? "done" : "now";
      $("time", tl[i]).textContent = TIMES[i];
      const bi = { 0: [0], 1: [1, 2], 4: [3] }[i] || [];
      bi.forEach((n, k) => setTimeout(() => bubbles[n].classList.add("show"), reduced ? 0 : k * 350));
    }
    $("#ticket-meta").innerHTML = "<span>Ticket #1042 · 2016 Ford F-250</span><span>Front brakes, pads and rotors</span><span>Total $386, approved by text</span>";
  }
  $("#lookup").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#ticket").value.replace(/\D/g, "");
    $("#ticket-err").textContent = v === "1042" ? "" : "This demo only has ticket #1042. Try that one.";
    if (v === "1042") track();
  });
  const sio = new IntersectionObserver(es => { if (es[0].isIntersecting) { track(); sio.disconnect(); } }, { threshold: 0.35 });
  sio.observe($("#status"));

  // ---------- reminders ----------
  const rDate = $("#r-date"), rOil = $("#r-oil"), rVeh = $("#r-vehicle"), rText = $("#r-text");
  const d0 = new Date(); d0.setMonth(d0.getMonth() - 2);
  rDate.value = d0.toISOString().slice(0, 10);
  const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined });
  function remind() {
    const base = rDate.value ? new Date(rDate.value + "T12:00:00") : new Date();
    const months = +rOil.value, due = new Date(base); due.setMonth(due.getMonth() + months);
    const miles = { 3: "3,000", 6: "7,500", 4: "5,000" }[months];
    $("#due-oil").textContent = fmt(due); $("#due-tire").textContent = fmt(due);
    $("#due-oil-note").textContent = `or ${miles} miles, whichever comes first`;
    const veh = rVeh.value.trim() || "vehicle";
    const bub = $("#remind-bubble");
    bub.textContent = `Six Point: your ${veh} is due for an oil change and tire rotation on ${fmt(due)}. Tap to book: sixpoint.example/book`;
    bub.classList.toggle("show", rText.checked);
    $("#remind-say").textContent = rText.checked
      ? "You'll get one text a week before it's due, with a link to book. Reply STOP any time. Demo only: nothing is scheduled or sent."
      : "Reminders are off. You can still check the dates here any time.";
  }
  [rDate, rOil, rVeh, rText].forEach(el => el.addEventListener("input", remind));
  $("#remind-form").addEventListener("submit", e => e.preventDefault());
  remind();

  // ---------- fleet ----------
  $("#fleet-form").addEventListener("submit", e => {
    e.preventDefault();
    const biz = $("#f-biz").value.trim(), n = +$("#f-units").value;
    if (!biz) { $("#f-err").textContent = "Please add your business name."; $("#f-biz").focus(); return; }
    if (!(n >= 1)) { $("#f-err").textContent = "How many vehicles? A rough number is fine."; $("#f-units").focus(); return; }
    e.target.outerHTML = `<div class="fleet-done" tabindex="-1" id="fleet-done"><p><b>Got it.</b> ${esc(biz)}, ${n} ${n === 1 ? "vehicle" : "vehicles"}. We'd call within a business day to set up your account and first service.</p><p style="margin-top:12px">Demo: nothing was saved or sent.</p></div>`;
    $("#fleet-done").focus();
  });

  // ---------- sample reviews ----------
  const REVIEWS = [
    ["They said the grind was pads and rotors, texted me the price, and had it ready that afternoon for exactly that.", "Pickup owner, Maynardville"],
    ["My tractor quit in the middle of hay season. They took it the next morning and had it back to me in two days.", "Farm owner, Union County"],
    ["I checked the status page instead of calling three times. The text came at 3:48 saying it was done.", "Commuter, Luttrell"],
  ];
  const swap = $("#quote-swap");
  $$("[data-r]").forEach(b => b.addEventListener("click", async () => {
    $$("[data-r]").forEach(x => x.setAttribute("aria-current", String(x === b)));
    swap.classList.add("fade"); await wait(250);
    const [t, w] = REVIEWS[+b.dataset.r]; $("#review-text").textContent = t; $("#review-who").textContent = w;
    swap.classList.remove("fade");
  }));

  // ---------- visit: today's hours ----------
  const today = new Date().getDay();
  $$("#hours tr").forEach(tr => { if (+tr.dataset.d === today) { tr.classList.add("today"); tr.firstElementChild.textContent += " (today)"; } });

  // ---------- FAQ cards ----------
  $$("#cards .card").forEach(card => $(".q", card).addEventListener("click", () => {
    const open = card.hasAttribute("data-open");
    $$("#cards .card").forEach(c => { c.removeAttribute("data-open"); $(".q", c).setAttribute("aria-expanded", "false"); });
    if (!open) { card.setAttribute("data-open", ""); $(".q", card).setAttribute("aria-expanded", "true"); }
  }));
})();
