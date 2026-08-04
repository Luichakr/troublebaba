# Design System: TROUBLEBABA · Bento Cake PDF Landing

> Single source of truth for the visual language.
> Every layout, spacing, color, and motion choice referenced anywhere in the
> codebase must trace back to a rule in this file. If a component needs
> something that breaks a rule, we update this file first and then the
> component — never the other way around.

## 1. Visual Theme & Atmosphere

A warm, editorial, gallery-airy landing for a premium indie pastry PDF.
Think **Kinfolk-magazine + Aesop skincare product page** — muted cream and
espresso, generous whitespace, confident asymmetric composition, one
disciplined mocha accent doing all the pulling.

- **Density: 3 (art-gallery airy).** Space is content. Sections breathe.
- **Variance: 4-5 (offset asymmetric).** No perfectly-centered heroes. No
  three-equal-cards-in-a-row. Split-screen and 2:3 / 3:2 grids preferred.
- **Motion: 5 (fluid CSS).** Slow, spring-eased reveals; no cinematic
  choreography, no bouncy dashboards.

The feeling on arrival: a well-lit prep kitchen at 9am. Quiet, unhurried,
confident.

## 2. Color Palette & Roles

Pulled from the PDF cookbook. One warm accent. No neon, no blue-purple, no
pure black.

- **Canvas Cream** (`#F5EFE8`) — Primary page background. Every section
  either sits on this or on a lighter surface layered above.
- **Warm White** (`#FDFAF6`) — Card fill, elevated panels, chip
  backgrounds. One notch brighter than canvas so cards read as lifted
  without a heavy shadow.
- **Soft Cream** (`#EFE4D2`) — Hover fill, secondary panels, subtle
  highlights that must not compete with warm-white cards.
- **Espresso Ink** (`#1A1A1A`) — Primary text, deep sections (bonus
  block, footer), high-contrast surfaces. Never pure black.
- **Mocha Accent** (`#8B7355`) — The one accent. CTA fill, active-state
  labels, price emphasis, section eyebrows, decorative line separators.
- **Mocha Dark** (`#6F5C43`) — Hover / pressed states of the mocha accent.
- **Taupe Line** (`#C8B8A2`) — 1px structural borders on cards and inputs;
  low-opacity variants (30–60%) for divider lines and quiet outlines.
- **Muted Ink** (`rgba(26,26,26,0.55)`) — Secondary body text, metadata,
  soft labels. Achieve by opacity, not by a new color token.

Rules:
- Maximum **one** accent color across the whole site. `#8B7355` and its
  darker sibling, nothing else.
- No pure black anywhere. If we ever need "black" text, use `#1A1A1A`.
- No cool-gray or blue-gray tokens. Neutrals live on a warm axis only.
- Semi-transparent variants (`espresso/55`, `mocha/40`, `taupe/30`) are the
  correct way to soften — never introduce a new hex to fake it.

## 3. Typography Rules

Two families do the work. Everything else is banned.

- **Display / Headlines: `Cabinet Grotesk`** — geometric sans with editorial
  personality. Track-tight (`letter-spacing: -0.02em`), weight-driven
  hierarchy (700 / 800 / 900), never screaming. Line-height `0.95–1.05` for
  huge hero words; `1.1` for section H2; `1.15` for card H3.
- **Body / UI: `Outfit`** — clean sans, softer than Geist, warmer than Inter.
  Weights 400 / 500 / 600 / 700. Line-height `1.6` for paragraphs, `1.5` for
  UI, `1.35` for chips and dense labels. Max measure `65ch` on paragraphs.
- **Stat / Number token: `font-stat`** (already in Tailwind config) —
  reserved for follower counts, price digits, quantity chips. Never on body.

Type scale (`clamp()` for hero, static rem for the rest):

| Role                | Size (desktop → mobile) | Weight | Track      |
|---------------------|-------------------------|--------|-----------|
| Hero display        | `clamp(3.4rem, 6.5vw, 6.4rem)` | 800 | `-0.02em` |
| Section H2          | `clamp(2.4rem, 5vw, 4rem)` | 800 | `-0.01em` |
| Sub-section H3      | `clamp(1.4rem, 2.4vw, 1.9rem)` | 700 | 0 |
| Card / block title  | `clamp(1.1rem, 1.7vw, 1.35rem)` | 700 | 0 |
| Lead paragraph      | `clamp(0.95rem, 1.2vw, 1.1rem)` | 400 | 0 |
| Body                | `15px` | 400 | 0 |
| UI label            | `13px` | 500 | `0.02em` |
| Eyebrow (uppercase) | `11px` | 700 | `0.18em` |

Banned in every context of this project:
- `Inter`, `Roboto`, `system-ui` as *display*. Cabinet Grotesk owns headlines.
- Generic serifs (`Times New Roman`, `Georgia`, `Palatino`, `Garamond`).
  If serif is ever needed for editorial pull-quotes, use `Fraunces` or
  `Instrument Serif` — never a system serif.
- Screaming huge text with a wispy 300-weight — hierarchy comes from
  weight and color, not just size.
- All-caps body copy. All-caps is reserved for eyebrows ≤ 12px.

## 4. Spacing & Layout Grid

- **Container:** `max-width: 1440px`, page inline padding
  `clamp(1.5rem, 4vw, 4rem)`. Never edge-to-edge on desktop.
- **Section vertical rhythm:** `clamp(4rem, 8vw, 8rem)` between top-level
  sections. Half of that (`clamp(2rem, 4vw, 4rem)`) between blocks *inside*
  a section.
- **Grid split for hero:** asymmetric 6:5 (content : image) on desktop.
  Never 1:1. Never centered.
- **Feature grids (multi-item lists):** 2-column zig-zag or asymmetric grid
  (`grid-cols-[2fr_3fr]` or reversed). The generic "3 equal cards in a row"
  layout is banned — either 2 offset columns, a 2+1 asymmetric layout, or
  a horizontal-scroll rail.
- **Padding scale (all values in rem):** `0.5 · 0.75 · 1 · 1.25 · 1.5 · 2
  · 2.5 · 3 · 4 · 5`. Card interior padding never below `1.25` (20px);
  block-CTA padding never below `1.75` (28px) horizontal.
- **Border radius scale:** `0.5rem` (chip), `0.75rem` (button), `1rem`
  (input), `1.5rem` (small card), `2rem` (large card/hero panel).
  No `9999px` pills except tag/eyebrow chips.
- **1px lines:** use `Taupe Line` at 30–60% opacity. Never a raw gray.
- **Group tolerance rule:** items in one visual group (e.g. chips, cards)
  must share the same padding, the same corner radius, and the same shadow
  depth. If two neighbors differ, they belong to different groups — and
  should be visually separated by a gap or a divider.

Responsive collapse:
- `< 768px` — every multi-column grid becomes single column. Never
  horizontal-scroll on mobile except for explicit scroll rails.
- Section vertical padding halves on mobile via the `clamp()` formulas.
- Touch targets minimum 44 × 44 px, always.

## 5. Component Stylings

### 5.1 Buttons

Two clean tiers, never more.

- **Primary CTA** (only one per section):
  - Fill `#8B7355`, text `#FDFAF6`, weight 700.
  - Radius `0.75rem` (`rounded-xl`).
  - Padding `0.875rem 1.5rem` (mobile) → `1rem 1.75rem` (desktop).
  - Shadow: `0 4px 14px rgba(139,115,85,0.28)`.
  - Hover: fill → `#6F5C43`, translate `-1px` (tactile push).
  - Active: translate `+1px`, shadow reduces to `0 2px 6px rgba(139,115,85,0.32)`.
  - **Label rule:** `white-space: nowrap`. If the label + price won't fit,
    the container is too narrow — fix the container, not the button.
  - **Optional perpetual pulse:** a slow 3s scale halo (`::after`) — only
    on the *single* primary CTA in the hero. Not on every button.
- **Ghost / Text CTA** (secondary):
  - No fill, no border. Text `mocha`, weight 600.
  - Underline appears on hover; no other movement.
  - Padding `0.5rem 0.75rem` to preserve a 44px hit target.

Banned button treatments:
- Outer glows, neon rings, purple gradient fills.
- Multiple primary CTAs stacked. If two things compete, one must become
  the ghost variant.
- Two-line button labels caused by wrap. If the label needs two lines,
  redesign the label copy or use a stacked structure (title above,
  meta below) with intentional line breaks, never accidental wrapping.

### 5.2 Chips (feature pills, filters, tag lists)

- Fill `Warm White`, 1px `Taupe Line` at 30%, radius `0.75rem`.
- Padding `0.5rem 0.75rem` (mobile) → `0.5rem 1rem` (desktop).
- Text `13px` on desktop, `11px` on mobile. Weight 500, `whitespace-nowrap`.
- Icon size: 14–16px, `flex-shrink: 0`, gap `0.5rem` between icon and text.
- **Group layout rule:** chips are always **content-sized** — never
  stretched to fill columns. Group them in a flex-wrap row and let them
  size to their content. If asymmetric wrap ever produces an ugly stray
  chip on a line by itself, that's a copywriting problem, not a CSS
  problem — shorten a label or merge two chips.
- Padding **must be identical** on every chip in a group. Two chips with
  different horizontal padding in the same row is an instant failure.

### 5.3 Cards

- Fill `Warm White`. 1px `Taupe Line` at 30%. Radius `1.5rem` (small) or
  `2rem` (large).
- Shadow: soft, tinted to the background hue —
  `0 8px 32px rgba(139,115,85,0.10)`. Never a raw black shadow.
- Padding: `1.5rem` mobile / `2rem` desktop for small cards; `2rem` /
  `3rem` for large cards.
- Hover on a linked card: lift `-2px` translate + shadow depth increases
  to `0 16px 48px rgba(139,115,85,0.14)`. No color change.
- **Elevation is meaning.** A card exists only when the content it holds
  is *different in kind* from what surrounds it (price card in a pricing
  section, testimonial in a text section). Do not wrap every paragraph in
  a card. In dense content areas, replace cards with a `1px Taupe Line`
  divider above a group.

### 5.4 Inputs

- Label above (`13px`, weight 500, uppercase eyebrow color).
- Field: fill `Warm White`, 1px `Taupe Line` at 60%, radius `0.75rem`,
  padding `0.75rem 1rem`, text `15px`.
- Focus: border → `Mocha Accent`, no outer ring/glow. Optional 2px inset
  shadow of the same color at 20% opacity.
- Error text below, `13px`, color `#A12B2B`, weight 500.
- No floating labels. No placeholder-as-label.

### 5.5 Section separators

- **Eyebrow + line pattern:** `— · Eyebrow · —` centered *or* left-aligned.
  Both sides of the eyebrow must carry a matching `1px × 2.5rem`
  `Taupe Line` (`opacity 40%`). Symmetric always. Never a line on one side
  only.
- **Heart / decorative motif:** the heart SVG used as a section marker
  must be flanked by two matching lines. Never a lone heart on the right
  of a line.

## 6. Motion & Interaction

Motion is quiet, spring-eased, and mostly for reveal — not decoration.

- **Default easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (spring-out). Duration
  `500–800ms` for reveals, `200–300ms` for hover state changes.
- **Reveal on scroll:** every `.reveal` element fades up 16px on
  intersection at 20% threshold. Cascade delay `80ms` between siblings for
  waterfall entry. Once revealed, no re-triggering.
- **CTA pulse:** the single primary hero CTA has a slow 3s halo pulse
  (`opacity 0 → 0.35 → 0`, `scale 1 → 1.08 → 1`). No other button pulses.
- **Card hover:** `transform: translateY(-2px)` + shadow depth change,
  `duration 300ms`, same easing. No color flashes.
- **Number counter:** the bonus-slots counter animates from `TOTAL` down
  to `TOTAL - sold` over `1800ms` when the container enters the viewport.
  One-shot, not looped.
- **Performance rules:** animate only `transform` and `opacity`. Never
  animate `width`, `height`, `top`, `left`. Grain / noise textures live on
  a fixed pseudo-element, not inline.

Banned motion:
- Bouncy overshoot springs on hovers.
- Auto-playing hero video with sound.
- Scroll-hijacking, snap-to-section, "scrollytelling" full-page transitions.
- Loading spinners (skeletal placeholders instead).
- Filler chevrons that bounce to "invite" scroll — content pulls, not
  arrows.

## 7. Layout Principles (project-specific)

- **Hero:** two acceptable asymmetric splits — never 50:50, never centered:
  - *Copy-forward* 60:40 (copy : image), or
  - *Image-forward* 40:60 (copy : image) — used on the homepage, where the
    styled product photo is the primary emotional hook. The copy column is
    capped at `max-width: 520px` and vertically centered; the image fills the
    remaining width full-bleed to the viewport edge on desktop.
  Left-aligned copy column, right-aligned hero image. Copy stack order:
  eyebrow +
  decorative motif → display headline → sub-paragraph → feature chip
  cluster → primary CTA + ghost CTA row → stats strip.
- **Primary CTA sits under the chip cluster**, aligned to the left column
  edge. `w-full` on mobile, `w-auto` on desktop.
- **Feature chips**: single flex-wrap row, `justify-start`, `gap 8px`
  (mobile) / `10px` (desktop). Chips are content-sized. Order chips by
  descending label length so wraps stay natural; if a wrap produces a
  visually awkward row, shorten a label instead of forcing CSS.
- **Pricing block:** dark espresso panel with `Warm White` text, single
  large accent price, one primary CTA, positive-guarantee note below,
  languages-available note below that. All left-aligned inside the panel.
- **"What's inside":** asymmetric 2-column grid — one narrow column with
  the small print, one wide column with the actual feature bullets.
  Never a 3-equal-cards row.
- **Recipes grid:** 2 rows × 4-5 columns of square cake photos with title
  overlay bottom-left. First recipe (best-seller) spans 2× width. Feed
  is horizontal-scroll on mobile.
- **Footer:** four columns of link groups on desktop, single column on
  mobile. `Taupe Line` divider between meta row and copyright row.

## 8. Anti-Patterns (Banned)

- No emojis in production copy, buttons, chips, or headings.
- No `Inter`, no `Roboto`, no `system-ui` display.
- No generic serifs. No system serif in dashboards, ever.
- No pure black (`#000000`).
- No neon outer glows or purple/blue accents.
- No 3-equal-cards horizontal feature grids.
- No centered hero (variance 4+).
- No two-line accidental button wraps (see button rules).
- No stretched chips (see chip rules).
- No fake statistics ("99.98% uptime", "10 000+ students") when the
  number isn't real. Owner has explicitly banned this project from
  quoting a student count.
- No AI copywriting clichés (`Elevate`, `Seamless`, `Unleash`, `Next-Gen`,
  `Simply the best`).
- No filler UI text (`Scroll to explore`, bouncing chevron, "swipe
  down").
- No custom mouse cursors. No cursor trailing effects.
- No broken external image links. Use local assets in `public/images/` or
  a stable CDN (`picsum.photos`, `ytimg.com/vi/*/hqdefault.jpg`).
- No `Georgia`-style default serifs baked into blog article `<p>` tags.
- No `w-screen` / `h-screen` — always `w-full` and `min-h-[100dvh]`.
- No `LABEL // YEAR` metadata formatting.

## 9. Enforcement

When editing a component:
1. Read the relevant section of this file first (color, type, spacing,
   or component).
2. Reach for existing tokens (Tailwind classes tied to these tokens)
   before inventing new values.
3. If a rule blocks a legitimate need, update this file first (add a
   named exception or a new rule), then update the component.
4. If a component drifts (a stretched chip, a two-line button, a bare
   line-heart, a raw gray shadow), that's a hot-fix — open a task to
   bring it back to the system, don't leave it.

The site is being iterated on by multiple hands. This file is the only
place where visual truth lives; component code should be a mechanical
projection of it.
