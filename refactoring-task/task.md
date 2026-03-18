# Design Redesign: Budget Tracker App

## Context

Attached HTML files are **design demos only** — static prototypes built for visual reference. They are not production code. Your task is to implement this design system properly inside the existing **SvelteKit + bits-ui** project.

Do not copy HTML/CSS from the demos. Use them **only as a visual reference** — like a Figma mockup.

---

## Design System

Extract the following tokens and apply them project-wide via CSS custom properties (e.g. in `app.css` or a dedicated `tokens.css`):

```css
--color-bg:        #08080f;
--color-surface:   #111118;
--color-border:    rgba(255, 255, 255, 0.07);
--color-text-1:    rgba(255, 255, 255, 0.85);
--color-text-2:    rgba(255, 255, 255, 0.45);
--color-text-3:    rgba(255, 255, 255, 0.22);
--color-label:     rgba(255, 255, 255, 0.20);
--color-accent:    rgba(80, 130, 255, 0.65);
--color-accent-bg: rgba(80, 130, 255, 0.10);
--color-accent-br: rgba(80, 130, 255, 0.20);
--color-danger:    rgba(255, 100, 100, 0.80);
--color-success:   rgba(80, 200, 120, 0.80);
--radius-sm:  10px;
--radius-md:  16px;
--radius-lg:  20px;
--radius-xl:  24px;
--radius-2xl: 28px;
```

Font: **DM Sans** (weights 300, 400, 500). Import from Google Fonts.

---

## Component Specifications

### Layout / Globals

- `body` background: `var(--color-bg)`
- All surfaces (cards, nav, modals): `var(--color-surface)` + `1px solid var(--color-border)` + appropriate `border-radius`
- No box-shadows — use border + ambient glow where needed (see below)

---

### Ambient Glow

Cards that need visual depth get **two absolutely-positioned pseudo-elements** (`::before` / `::after`) with:

```css
position: absolute;
border-radius: 50%;
pointer-events: none;
background: radial-gradient(ellipse, <color> 0%, transparent 70%);
animation: ambientPulse 5s ease-in-out infinite;
```

Glow colors per context:
- Budget / primary card: blue `rgba(60,100,220,0.16)` top-left + purple `rgba(120,50,200,0.12)` bottom-right
- Stat card left: blue `rgba(60,100,220,0.14)` top-center
- Stat card right: purple `rgba(120,50,200,0.12)` top-center
- Empty state: blue `rgba(80,130,255,0.10)` top-center

```css
@keyframes ambientPulse {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1;   }
}
```

---

### Label style (reusable)

Uppercase section labels used throughout:

```css
font-size: 10px;
font-weight: 500;
letter-spacing: 1.4px;
text-transform: uppercase;
color: var(--color-label);
```

---

### Progress Bar

```
height: 3px
track background: rgba(255,255,255,0.07)
fill background: rgba(80,130,255,0.65)
border-radius: 2px
```

Dot at end of fill (when progress > 0):
```
width/height: 9px, border-radius: 50%
background: rgba(120,170,255,0.9)
box-shadow: 0 0 6px rgba(100,150,255,0.5)
position: absolute; right: -4px; top: 50%; transform: translateY(-50%)
```

---

### Donut Chart

Implement using inline `<svg>` with `<circle>` strokes (not a chart library):

```
ring radius: 42 (on 110×110 viewBox)
stroke-width: 10
stroke-linecap: round
track stroke: rgba(255,255,255,0.04)
```

Segment colors:
- Food / primary:    `rgba(74,127,255,0.75)`
- Transport:         `rgba(123,79,255,0.65)`
- Shopping:          `rgba(255,107,107,0.60)`
- Other:             `rgba(255,255,255,0.12)`

Each segment: `stroke-dasharray="<length> <circumference>"` + `stroke-dashoffset="-<accumulated>"` + `transform="rotate(-90 55 55)"`

Center text: spent amount + "витрачено" sub-label.

---

### Expense List Item

```
padding: 11px 14px
border-top: 1px solid rgba(255,255,255,0.04)
gap: 12px
```

Icon container:
```
width/height: 38px, border-radius: 12px
background: rgba(255,255,255,0.05)
border: 1px solid rgba(255,255,255,0.07)
icon stroke: rgba(255,255,255,0.45)
```

Use **category-specific accent color** for icon stroke when category is known (food → blue, transport → purple, shopping → red).

Amount: `color: var(--color-danger)`, `font-weight: 500`.

---

### Empty State

Centered layout inside surface card:

```
icon container: 52px, border-radius: 18px
title: 14px, weight 500, color: rgba(255,255,255,0.65)
subtitle: 12px, weight 300, color: rgba(255,255,255,0.25), max-width: 200px
```

CTA button inside empty state:
```
background: var(--color-accent-bg)
border: 1px solid var(--color-accent-br)
color: rgba(100,160,255,0.85)
border-radius: var(--radius-md)
font-size: 13px, weight 500
```

---

### Bottom Navigation

```
background: var(--color-surface)
border: 1px solid var(--color-border)
border-radius: var(--radius-2xl)
padding: 9px 6px
```

Nav buttons: `40×40px`, `border-radius: 50%`

Active state:
```
background: rgba(255,255,255,0.06)
border: 1px solid rgba(255,255,255,0.09)
icon stroke: rgba(255,255,255,0.75)
```

Plus button:
```
width/height: 42px
background: rgba(70,120,255,0.14)
border: 1px solid rgba(70,120,255,0.22)
icon stroke: rgba(100,150,255,0.75)
```

Inactive icons stroke: `rgba(255,255,255,0.22)`

---

### Entrance Animations

Each page section fades in with staggered delay:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Apply to sections in order with `animation-delay: 0.05s, 0.12s, 0.20s, 0.28s, 0.36s`.

Use Svelte `transition:` or `in:` directives — **not raw CSS animations** where Svelte transitions are available.

---

## Pages to Redesign

### 1. Onboarding (4 steps)

Reference: `onboarding.html`

Implement as a Svelte component with a `currentStep` store (0–3). Progress bar at top: 4 segments, `height: 2px`, done = `rgba(255,255,255,0.7)`, active = `rgba(255,255,255,0.45)`, inactive = `rgba(255,255,255,0.10)`.

Each step has:
- Visual illustration area (SVG, ~280px height) with ambient glow specific to that step
- Step counter label `"01 / 04"` style
- Title: `28px, weight 500, letter-spacing: -0.8px`, muted words in `rgba(255,255,255,0.38) weight 300`
- Description: `14px, weight 300, color: rgba(255,255,255,0.38), line-height: 1.6`

Primary button: `background: rgba(255,255,255,0.95); color: #08080f; border-radius: 18px; padding: 16px; font-size: 15px; font-weight: 500`

Skip link: `font-size: 12px; color: rgba(255,255,255,0.2)`

Step transitions: use Svelte `fly` transition `(x: 30, duration: 350)`.

---

### 2. Home — First Launch (empty state)

Reference: `home_first_launch.html`

Show this variant when `transactions.length === 0` for the current month.

Sections (top to bottom):
1. Header (greeting + avatar)
2. Hero balance
3. Budget progress card (with ambient glow, progress = 0%)
4. "Останні витрати" section with empty state card + CTA
5. Tip card
6. Bottom nav

No quick actions row.

---

### 3. Home — Active State

Reference: `home_active.html`

Show when `transactions.length > 0`.

Sections:
1. Header
2. Hero balance + chip (`–X%` or `Новий місяць`)
3. Donut chart card (spending breakdown by category) with period toggle (Тиж / Міс / Рік)
4. Stat cards row (spend per day + days remaining)
5. Recent expenses list (last 3–5 transactions)
6. Bottom nav

---

## Implementation Notes

- Use **bits-ui** primitives for: tabs (period toggle on donut), dialog/drawer (add expense), tooltip (progress bar hover).
- All colors via CSS custom properties — no hardcoded hex in component styles.
- Glow effects via `::before` / `::after` on the card wrapper — **not** extra DOM elements.
- Donut chart: plain SVG, no external chart library needed.
- All text strings in Ukrainian (as shown in demos).
- Dark mode only — no light mode toggle needed.
- Do not add features not shown in the demos. Stick to the visual spec.

---

*HTML demos are attached for visual reference. Treat them as Figma exports — source of truth for spacing, color, and layout. Do not reuse their code.*
