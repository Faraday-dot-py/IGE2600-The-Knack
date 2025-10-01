# Overview

**Working title:** *The Knack*

**Premise in one line:** A short, mobile‑friendly browser game about being someone who “understands machines better than people.” Players solve rapid, one‑minute puzzles—some mechanical, some social—while juggling two meters: **Social Standing (SS)** and **Personal Contentment (PC)**. You can’t max both; prioritizing PC yields the overall win condition and mirrors the autoethnographic message.

**Autoethnographic intent:** This is a first‑person playable reflection on the lived experience of having “the knack”—intuitive problem solving with machines alongside friction in social contexts. The mechanics intentionally make **mechanical tasks legible and satisfying** while **social interactions feel ambiguous, effortful, and sometimes punishing**, inviting outsiders to experience the asymmetry.

**Target playtime:** 8–12 minutes total; **\~60 seconds per puzzle**.

**Form factor:** Mobile‑first, runs in any modern browser; deployable to a simple website.

---

# Game style

- **Genre:** Narrative micro‑puzzle / vignette adventure.
- **Loop:** (Context vignette) → (One 60s puzzle) → (Result: ★ rating + SS/PC deltas) → (Short reflection line) → (Next vignette).
- **Aesthetics:** Clean SVG line art, minimal UI, haptic‑like snap/sound feedback. Soft, non‑judgmental tone in narration.
- **Difficulty intent:** Mechanical puzzles teach themselves via affordances; social puzzles obscure success criteria and yield non‑obvious outcomes.

---

# Storyline

**Day‑in‑the‑life framing:** You’re preparing for a community demo night. Over one day you bounce between getting a project ready and navigating social situations around it. The six vignettes:

1. **Printer Panic** (mechanical) — get a 3D printer to behave.
2. **Small Talk, Big Gap** (social) — a “basic” chat that drifts into miscommunication.
3. **Power Loop** (mechanical) — snap together a simple circuit to power a small fan.
4. **Show & Tell (…or Brag?)** (social) — share a project without being read as bragging.
5. **Clockwork Calm** (mechanical) — build a simple gear clock that actually ticks.
6. **Words That Don’t Land** (social) — an argument with constrained word choices.

**Endings:**

- **Fulfilled (Win):** PC ≥ 70 and you ship/demo the project, even if SS is modest.
- **People‑Pleaser (Bittersweet):** SS ≥ 80 but PC < 70; you smoothed things over but feel hollow.
- **Overloaded (Lose):** Either meter ≤ 10 at any point; you burn out or burn bridges.

---

# Core systems

**Meters**

- **Social Standing (SS):** How you’re perceived/accepted in the moment.
- **Personal Contentment (PC):** Sense of authenticity, competence, and comfort.
- **Tradeoff rule:** Some choices raise one while lowering the other; **it is impossible to max both** by design.

**Per‑puzzle ★ rating**

- 0–3 stars per puzzle based on **Time**, **Attempts/Errors**, and **Hints Used**. (Formula below.)

**Hints**

- Mechanical puzzles: subtle glow/ghost outline after 20s idle.
- Social puzzles: a vague “gut” hint that may or may not help.

**Timer**

- Soft 60s target; at 75s apply diminishing returns to ★ reward, not a hard fail.

---

# Scoring & balancing

**Star formula (per puzzle)**

- Start at 3★. Deduct:
  - **−1★** if time > 60s; **−2★** if > 90s.
  - **−1★** if attempts > 3 (mechanical) or missteps > 2 (social).
  - **−1★** if any hint used.
- Minimum 0★.

**Meter deltas (per puzzle)**

- Mechanical success (3★): **PC +15**, SS +5. (2★: PC +10, SS +3. 1★: PC +6, SS +2. 0★: PC −5, SS −2.)
- Social success (3★): **SS +15**, PC +5. (2★: SS +10, PC +3. 1★: SS +6, PC +2. 0★: SS −8, PC −4.)
- **Tradeoff hooks:** Certain “authentic” responses grant **extra PC +8 and SS −6**; “masking” responses grant **SS +8 and PC −6**. These appear especially in social puzzles 2, 4, and 6.

**Win logic**

- Compute **Overall Outcome** after puzzle 6:
  - If **PC ≥ 70:** display *Fulfilled* ending (overall win) regardless of SS.
  - Else if **SS ≥ 80:** display *People‑Pleaser* ending (bittersweet).
  - Else: *Overloaded*.

---

# Puzzle designs (production‑ready briefs)

Each brief includes: **Goal, Interface, Interactions, Feedback, Hints, Success, Failure, Meter Effects, Reflection line.**

## 1) PRINTER PANIC (3D printer)

- **Goal:** Achieve first‑layer adhesion via bed leveling and nozzle temp.
- **Interface:** Top‑down printer bed; three corner knobs; live “squish” preview of a drawn line; temp slider.
- **Interactions:** Drag to turn knobs; slider to 190–210°C. A paper‑thickness gauge (visual only) appears as a ghost when close.
- **Feedback:** Extrusion line changes from beaded → smooth “squish” with a satisfying sound; bed corners highlight when in range.
- **Hints (20s):** Slight glow on the high corner; temp slider subtly pulses near 200°C.
- **Success:** All three corners within tolerance + temp 195–205 → auto draws a clean skirt.
- **Failure:** Over‑/under‑squish at any corner after 90s.
- **Meters:** See “mechanical success” table; bonus **PC +4** for achieving in <40s.
- **Reflection line:** “I can *feel* it in the layer line before I can explain it.”

## 2) SMALL TALK, BIG GAP (miscommunication)

- **Goal:** Sustain a basic chat without derailing.
- **Interface:** SMS‑like bubble UI; 3 replies per turn.
- **Interactions:** Choose one reply. Hidden intent tags: {literal, context‑seeking, topic‑shift}.
- **Feedback:** Partner mood icon drifts (pleased/neutral/annoyed). No explicit correctness.
- **Hints (30s):** “Your gut says: keep it light.”
- **Success:** Keep mood ≥ neutral for 4 exchanges.
- **Failure:** Mood drops to annoyed twice.
- **Meters:** Success boosts **SS**; “authentic” context‑seeking options add **PC +8, SS −6**.
- **Reflection line:** “I answer the question asked, not the question meant.”

## 3) POWER LOOP (snap circuit)

- **Goal:** Snap together a simple **battery → switch → fan** circuit so the fan spins inside the target ring.
- **Interface:** Minimal circuit board with **three slots** labeled **A / B / C**; component tray with **Battery Pack**, **Toggle Switch**, **Motor+Fan**; **tap‑to‑rotate** control for orientation.
- **Interactions:** Drag a component into any slot; it **magnetically snaps**. Tap to rotate 90°. Simple **polarity icons (+/−)** on the board must align with the battery terminals; the board auto‑wires **left → right** when all three slots are filled.
- **Feedback:** Correct placement emits a crisp snap and shows a short wire glow; wrong order/rotation gives a gentle bounce and a red wire flicker. When solved, the fan spins and a soft whoosh plays.
- **Hints (20s):** Subtle arrow glow left→right; the battery **+** terminal briefly pulses.
- **Success:** Components placed **left → right as Battery → Switch → Motor** with correct battery orientation within 60–90s.
- **Failure:** ≥6 invalid drops/rotations or timeout.
- **Meters:** Mechanical success table; **bonus PC +3** for zero hints.
- **Reflection line:** “When the path is clear, power flows.”

## 4) SHOW & TELL (…or brag?) SHOW & TELL (…or brag?)

- **Goal:** Share a cool project without being perceived as bragging.
- **Interface:** Conversation with a peer; 3 choices per line.
- **Key design:** Choices interleave **content** and **framing** (e.g., “I built X” vs “I’m excited about what I learned in X”).
- **Success:** Mention achievement **and** process; ask a sincere question back.
- **Failure:** Over‑index on achievement (SS −8) or undersell to self‑erase (PC −6).
- **Meters:** Success favors SS; “authentic pride” branch grants PC +8, SS −6.
- **Reflection line:** “Sharing joy reads different depending on who’s listening.”

## 5) CLOCKWORK CALM (build a clock)

- **Goal:** Mesh two gears to hit a target tick rate (e.g., 1 Hz) powering a second hand.
- **Interface:** Palette of 4 gear sizes with tooth counts; draggable axles; target rate indicator.
- **Interactions:** Drag gears onto axles; connect by overlap to mesh; a crank animates the mechanism; tick rate meter updates in real time.
- **Hints (25s):** Highlight a near‑solution gear pair.
- **Success:** Achieve target within tolerance and run for 3 “ticks”.
- **Failure:** Jam gears (tooth collision) or miss tolerance after 90s.
- **Meters:** Mechanical success table; **bonus PC +3** for first‑try mesh.
- **Reflection line:** “Ratios soothe me; the world makes sense in teeth.”

## 6) WORDS THAT DON’T LAND (argument with 3 options)

- **Goal:** Navigate a heated exchange. Options at each turn:
  1. **Simple agreeable but wrong**
  2. **Simple upsetting and wrong**
  3. **Complex precise and right**
- **Interface:** Dialogue with meter for interlocutor’s “perceived intent.”
- **System:** Picking (3) advances truth but triggers the line: “Stop using big words to confuse me.” Picking (1) keeps peace but erodes PC. Picking (2) escalates conflict.
- **Success:** Reach a boundary‑setting statement without personal attack (requires at least one (3) plus one empathetic reframe).
- **Failure:** Two escalations or self‑erasure sequence.
- **Meters:** Success → SS +12, PC +5; heavy (3) usage → **PC +8, SS −6** authenticity bonus/penalty as designed.
- **Reflection line:** “Precision helps me think; it doesn’t always help me connect.”

---

# UI/UX blueprint

- **HUD:** Top bar with **SS** and **PC** meters; center puzzle area; bottom timer + ★.
- **Color:** Neutral grayscale with accent color for interactables; color‑blind‑safe contrasts.
- **Microcopy:** Gentle, first‑person tooltips (“I nudge the knob clockwise…”) to cue autoethnographic voice.
- **Audio:** Soft clicks, gentle whirr, ticking; no harsh buzzers.
- **Mobile layout:** Single‑column; large touch targets; drag‑and‑drop optimized.

---

# Software stack (web‑only, deploy‑in‑a‑day)

**Primary recommendation**

- **Vite + TypeScript** (fast dev, easy deploy)
- **React** for UI and screens
- **Zustand** for global game state (meters, stars, level progression)
- **react‑dnd** for drag‑and‑drop (Power Loop)
- **Framer Motion** for snap/bounce animations and transitions
- **Howler.js** for click/tick sounds
- **SVG assets** created in Figma/InkScape
- **Deployment:** GitHub Pages / Vercel / Netlify

**Alternative (more game‑engine‑y)**

- **Phaser 3** + TypeScript for unified game loop; UI via Phaser scenes.

---

# Data & content structure (no code)

**Level config (JSON‑like)**

```text
Level {
  id: string,
  type: 'mechanical' | 'social',
  title: string,
  goal: string,
  timerTargetSec: 60,
  scoring: { timeCutoffs: [60, 90], attemptsThreshold: 3, hintPenalty: true },
  meterEffects: { base: { PC: n, SS: n }, authenticityHook?: { PC: +8, SS: -6 } },
  assets: { sprites: string[], sfx: string[] },
  script?: DialogueNode[] // for social levels
}
```

**Game state**

```text
GameState {
  PC: 50, SS: 50, // start values
  starsByLevel: Record<levelId, 0|1|2|3>,
  flags: { usedHint?: boolean, authenticChoice?: boolean },
  ending?: 'Fulfilled' | 'People-Pleaser' | 'Overloaded'
}
```

---

# Accessibility checklist

- High contrast text and icons; 16px+ base type.
- Motion‑reduction toggle (disables bounces, reduces parallax).
- Text alternatives for sounds; captions on dialogue.
- “Plain‑language” captions option for social puzzles that explains implied meanings **after** completion for reflection.

---

# Production plan (due tomorrow → build the MVP)

**Scope for MVP (3–5 hours of focused work):**

1. Project scaffold (Vite + TS + React + Zustand). Title screen + level router.
2. Implement meters HUD and results modal (★, SS/PC deltas).
3. Build **Power Loop** snap‑circuit (three slots; drag, snap, rotate; auto‑wire; success = spinning fan).
4. Build **Small Talk, Big Gap** with 4 exchanges, 3 choices each, and mood drift.
5. Add basic sounds (snap, tick) and simple transitions.
6. Add endings logic + simple ending screens.
7. Nice‑to‑have if time: Printer Panic or Clockwork Calm as a second mechanical level.

**Stretch polish (if time):** ghost hints, analytics, accessibility toggles.

---

# One‑page written analysis (template to fill)

**Subject & culture:** I explore “the knack”—an intuitive connection to systems/machines alongside social friction—as a culture I inhabit.

**Materials & method:** I built a browser micro‑puzzle game with SVG art and short vignettes. Design intentionally made mechanical tasks legible/satisfying and social tasks ambiguous to simulate lived asymmetry.

**How it communicates my ideas:**

- **Mechanics as metaphor:** Snapping parts and clear feedback model fluency with systems.
- **Ambiguity in dialogue:** Unclear success criteria and mood drift model social guesswork.
- **Tradeoff meters:** SS vs PC encode masking vs authenticity; the impossible max dramatizes costs.
- **Reflection lines:** Short first‑person lines anchor scenes in my voice.

**Why it matters:** It “speaks back” to perceptions that competence = ease in all domains; it shows how success in one domain may tax another, inviting empathy.

(Keep it to \~1 page, single‑spaced; adapt language to your voice.)

---

# 5‑minute presentation outline

1. **Hook (30s):** One sentence about “the knack.” Show the SS/PC meters.
2. **Design intent (60s):** Why mechanical puzzles are clear; social ones are murky.
3. **Two quick demos (2 min): **Power Loop** (snap circuit) + **Small Talk** (ambiguity).
4. **Autoethnographic link (60s):** How systems embody your experience; what outsiders may misread.
5. **Closing (30s):** Outcomes/ending; what you hope players take away.

---

# Dialogue samples (ready to paste)

**Small Talk, Big Gap**

- Them: “Crazy weather, huh?”
  - A) “Barometric pressure dropped 12mb in 2 hours.” *(literal → mood −)*
  - B) “Yeah, wild. Did it mess with your day?” *(light + question → mood +)*
  - C) “I was modeling airflow patterns actually.” *(topic‑shift → mood ±)*

**Show & Tell (…or brag?)**

- Them: “What’ve you been working on?”
  - A) “I built a hand that can pick up a grape. Watch.” *(achievement‑heavy)*
  - B) “I got stuck on tendon routing, then learned a neat trick. Want to see?” *(process + invite)*
  - C) “Nothing special.” *(self‑erase)*

**Words That Don’t Land**

- Them: “You’re overcomplicating it.”
  -
    1. “Sure, whatever you say.” *(agreeable but wrong)*
  -
    2. “You don’t get it.” *(upsetting)*
  -
    3. “I’m using precise terms so we don’t talk past each other.” *(precise; triggers ‘big words’ line)*

---

# Asset list (quick view)

- **SVGs:** Printer bed + knobs; filament line; **battery pack; toggle switch; motor+fan; circuit board + wires**; 4 gear sizes; axles; mood icons; meters; buttons.
- **SFX:** click, snap, whirr, tick; soft “pop” for UI.
- **Fonts:** System UI or an accessible open font (e.g., Inter, Atkinson Hyperlegible).

---

# Art & UI Asset Manifest (detailed)

**Art direction:** Clean, flat SVG line art with consistent stroke weight, rounded joins, and color‑blind‑safe accents. Prefer vector over raster. Keep all pieces inside a shared **viewBox = 1024×576** (landscape) and **576×1024** (portrait) to preview composition; the game will scale them at runtime.

**General export rules**

- File format: **SVG** (group layers, name important nodes with ids).
- Base stroke: **2.5px at 1024×576** (scales cleanly); rounded joins/caps.
- Palette: `--ink` (text), `--line` (strokes), `--accent` (interactive), `--ok`, `--warn`, `--error`. Keep flat fills; avoid heavy filters/shadows.
- States: provide **idle**, **hover/focus**, **active/drag**, **valid**, **invalid** variants where noted (use color/outline only; no separate art for each size).
- Naming: `scene-element-state.svg` (e.g., `hand-thumb-idle.svg`, `ui-star-filled.svg`).
- Foldering: `/art/ui`, `/art/icons`, `/art/hand`, `/art/printer`, `/art/clock`, `/art/social`, `/art/effects`.

---

## Shared UI (used in all scenes)

- **Logo/Title wordmark**: `logo-title.svg` (simple wordmark).
- **HUD meters**
  - Social Standing icon: `icon-ss.svg` (two stylized silhouettes).
  - Personal Contentment icon: `icon-pc.svg` (gear + heart glyph).
  - Horizontal meter bars (empty/half/full endcaps): `meter-bar.svg` (+ mask slice for fill).
- **Timer**: `timer-ring.svg` (circular ring with tick marks; inner label placeholder).
- **Stars**: `ui-star-empty.svg`, `ui-star-filled.svg` (3 copies in HUD and results modal).
- **Buttons**: `btn-primary.svg`, `btn-ghost.svg` (9‑slice or sufficiently padded background plate), back/next chevrons.
- **Modals/Panels**: `panel-rounded.svg` (9‑slice capable rectangle), `panel-tooltip.svg`.
- **Icons**: `icon-hint.svg` (lightbulb), `icon-sound-on.svg`, `icon-sound-off.svg`, `icon-retry.svg`, `icon-home.svg`, `icon-reduced-motion.svg`.
- **Particles/FX**: `fx-snap-ring.svg` (concentric ring burst), `fx-pop.svg` (small starburst), `fx-glow-outline.svg` (soft outline path used as mask).

---

## Scene 1 — PRINTER PANIC (3D printer)

- **Printer bed & frame**: `printer-bed.svg` (bed with 3 adjustable corners, center grid), `printer-frame.svg` (minimal gantry outline).
- **Knobs** (3): `knob-corner.svg` (idle/active variants). Provide separate **highlight overlays** for in‑range corners: `knob-glow.svg`.
- **Nozzle & filament**: `nozzle.svg` (with origin point for path), `filament-line.svg` (short segments for beaded/smooth states), `skirt-path.svg` (success draw path).
- **Temperature UI**: `temp-slider-track.svg`, `temp-thumb.svg`, and a tiny `icon-thermometer.svg`.
- **Paper gauge hint**: `gauge-paper.svg` ghost overlay that appears under the nozzle when close.
- **Status cues**: `icon-check.svg`, `icon-warning.svg` (small badges near corners).

**Animation/effects used**: snap/glow outlines and path morphing for filament (done in code; art provides base paths only).

---

## Scene 2 — SMALL TALK, BIG GAP (social)

- **Chat frame**: `chat-frame.svg` (phone‑like bezel or clean rounded container).
- **Chat bubbles** (3 sizes): `bubble-left.svg`, `bubble-right.svg` (with tail as separate layer so it can flip).
- **Avatar silhouettes**: `avatar-them.svg`, `avatar-you.svg` (neutral, non‑specific).
- **Mood icons**: `mood-positive.svg`, `mood-neutral.svg`, `mood-annoyed.svg` (for subtle HUD indicator).
- **Typing indicator**: `typing-ellipses.svg`.
- **Choice buttons**: `choice-plate.svg` (background plate the text sits on; large touch targets).
- **Debrief card art**: `card-debrief.svg` (used after puzzle to reflect on miscommunication).

---

## Scene 3 — POWER LOOP (snap circuit)
- **Board base**: `board-base.svg` (three labeled slots **A/B/C** with subtle left→right arrows; small **+/−** markers near slot A).
- **Components**: `comp-battery.svg` (with clear **+/−** terminals), `comp-switch.svg` (toggle with on/off states), `comp-motor-fan.svg` (simple fan propeller motor).
- **Wiring**: `wire-auto.svg` (short segments the code animates between slots), `wire-glow.svg` (used for success pulse), `icon-order.svg` (optional tiny arrow icon).
- **Feedback/targets**: `target-ring.svg` (fan spins inside it on success), reuse `fx-snap-ring.svg` for snaps.
- **Controls**: `icon-rotate.svg` (appears near a grabbed component to cue tap‑to‑rotate).

---

## Scene 4 — SHOW & TELL (…or brag?)

- **Dialogue frame**: reuse `chat-frame.svg` but with a **peer setting** header: `header-peer.svg` (neutral venue icon).
- **Reaction markers**: `icon-listen.svg`, `icon-eye-roll.svg`, `icon-star-small.svg` (used sparingly as subtle reactions).
- **Project thumbnail**: `thumb-hand-demo.svg` (stylized grape lift), used when the player chooses to show the build.
- **Choice plates**: reuse `choice-plate.svg` (ensure three side‑by‑side fit ≥768px; stacked otherwise).

---

## Scene 5 — CLOCKWORK CALM (gear clock)

- **Gears** (4 sizes): `gear-08t.svg`, `gear-12t.svg`, `gear-16t.svg`, `gear-24t.svg` (teeth counts labeled in ids). Keep center bores aligned; teeth drawn with simple involute‑ish shape.
- **Axles/Posts**: `post.svg` (short and tall variants), `crank.svg` (handle for manual spin).
- **Dial & hand**: `dial-ring.svg` (minute/second ticks), `hand-second.svg`.
- **Jam indicator**: `icon-jam.svg` (small red cross gear overlay), `gear-spark.svg` (tiny collision spark FX).
- **Rate target**: `target-1hz.svg` (HUD widget showing target tick rate).

---

## Scene 6 — WORDS THAT DON’T LAND (argument)

- **Dialogue frame**: `dialogue-argument.svg` (more spacious text area; subtle heat gradient background strip optional).
- **Option tokens**: `token-agreeable.svg`, `token-upsetting.svg`, `token-precise.svg` (generic icons for 1/2/3; text comes from code).
- **Perceived‑intent meter**: `meter-intent.svg` (small slider‑like bar).
- **Interruption badge**: `badge-big-words.svg` (appears when precise option triggers the “big words” line).

---

## System & Navigation

- **Title & Menu**: `screen-title.svg`, `menu-buttons.svg`.
- **Results modal**: `modal-results.svg` (3 stars slots, SS/PC delta arrows).
- **Endings**: `ending-fulfilled.svg`, `ending-people-pleaser.svg`, `ending-overloaded.svg` (small emblem + headline container).
- **Onboarding**: `tutorial-hand.svg` (drag gesture), `tutorial-tap.svg`, `tutorial-rotate.svg` (optional).

---

## Accessibility alternates

- **High‑contrast pack**: overrides for UI icons and meters (`hc-*.svg`).
- **Plain‑language overlays**: `overlay-meaning.svg` (appears in post‑puzzle debrief to explain implied meanings). Kept off during play.
- **Reduced‑motion**: static versions of FX (`fx-snap-ring-static.svg`).

---

# (Optional) Raster assets

If you prefer a textured feel, include **1×/2× PNGs** for subtle paper noise overlays: `tex-paper@1x.png`, `tex-paper@2x.png` (1024×1024, 2–3% opacity in CSS). Not required for MVP.

---

# Quick audio cue list (for reference)

- `sfx-snap.mp3` (piece snaps in), `sfx-bounce.mp3` (invalid drop), `sfx-tick.mp3` (clock), `sfx-whirr.mp3` (printer), `sfx-pop.mp3` (UI), `sfx-success.mp3`, `sfx-fail.mp3`.

---

# Delivery checklist

- ✅ All SVGs exported with named ids (no rasterized text).
- ✅ ViewBox set, no fixed px sizes; keep strokes consistent.
- ✅ Icons at 24×24 grid; stars at 32×32; buttons with ≥12px padding inside.
- ✅ Test legibility at 320px wide.

---

# Risks & mitigations

- **Drag‑and‑drop on mobile:** Prefer pointer events; large hitboxes.
- **Ambiguity frustration:** Post‑puzzle debrief text explains the intended cultural insight.
- **Performance:** Stick to SVG and lightweight state; defer heavy assets.

---

# What “done” looks like (MVP)

- Title → 2–4 vignettes playable → ★ per puzzle → SS/PC meters change → Ending screen fires → You can host it on a simple site and present it.

