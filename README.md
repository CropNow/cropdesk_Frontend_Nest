# CropDesk Frontend

Frontend for the CropDesk dashboard — a sunlight-readable, farmer-facing monitoring UI for crop, soil, weather and device telemetry.

## Getting Started

1. `npm install`
2. `npm run dev`
3. `npm run build`

---

## Design System

The visual system is **human-curated** (not AI-generated) with one explicit goal: **legibility under direct sunlight on a phone in the field.** Tokens follow standard, named palettes so contributors don't guess hex values.

### Typography

| Role | Font | Source | Weights used |
|------|------|--------|--------------|
| Body / UI | **Outfit** | Google Fonts | 300, 400, 500, 600, 700, 800 |
| Monospace / Code | **JetBrains Mono** | Google Fonts | 400, 500, 600 |

Outfit is a humanist geometric sans with wide apertures — chosen for high readability on small screens in bright light. Loaded at `src/index.css` line 2.

**Default weights by element**

| Element | Weight |
|---------|--------|
| Body text | 400 |
| Labels / captions | 500 |
| Section headings | 600 |
| Page titles / metric values | 700 – 800 |

### Color Palette — `Tailwind Slate + Emerald 700`

A two-family palette: **Tailwind CSS Slate** for all neutrals and **Tailwind CSS Emerald** for the brand accent. Both are the official, named Tailwind v3 shades — so any contributor can reference them by number.

#### Light theme (sunlight-optimized)

| Token | Tailwind name | Hex | Contrast vs `#FFFFFF` |
|-------|---------------|-----|-----------------------|
| `--text-primary` / `--text-heading` | Slate 900 | `#0F172A` | 19.3 : 1 (AAA) |
| `--text-body` | Slate 800 | `#1E293B` | 14.7 : 1 (AAA) |
| `--text-secondary` / `--text-label` | Slate 700 | `#334155` | 10.4 : 1 (AAA) |
| `--text-muted` | Slate 600 | `#475569` | 7.5 : 1 (AAA) |
| `--text-hint` | Slate 500 | `#64748B` | 4.6 : 1 (AA) |
| `--border-color` | Slate 300 | `#CBD5E1` | — |
| `--bg-main` | Slate 50 | `#F8FAFC` | — |
| `--bg-card` | White | `#FFFFFF` | — |
| `--accent-primary` | Emerald 700 | `#047857` | 4.8 : 1 (AA) |
| `--accent-secondary` | Emerald 800 | `#065F46` | 8.3 : 1 (AAA) |
| `--accent-cyan` | Cyan 700 | `#0E7490` | 5.4 : 1 (AA) |
| `--accent-purple` | Violet 700 | `#6D28D9` | 7.6 : 1 (AAA) |
| `--accent-amber` | Amber 700 | `#B45309` | 4.7 : 1 (AA) |
| `--accent-rose` | Rose 700 | `#BE123C` | 6.7 : 1 (AAA) |

#### Dark theme

| Token | Tailwind name | Hex / value |
|-------|---------------|-------------|
| `--text-primary` | Slate 100 | `#F1F5F9` |
| `--text-secondary` | Slate 300 | `#CBD5E1` |
| `--text-muted` | Slate 400 | `#94A3B8` |
| `--text-heading` | White | `#FFFFFF` |
| `--text-body` | white / 0.85 | `rgba(255,255,255,0.85)` |
| `--text-label` | white / 0.75 | `rgba(255,255,255,0.75)` |
| `--text-hint` | white / 0.55 | `rgba(255,255,255,0.55)` |
| `--bg-main` | custom near-black | `#0A0E14` |
| `--bg-card` | custom slate | `#12181F` |
| `--accent-primary` | Emerald 400 | `#34D399` |
| `--accent-secondary` | Emerald 500 | `#10B981` |
| `--accent-cyan` | Cyan 400 | `#22D3EE` |
| `--accent-purple` | Purple 500 | `#A855F7` |
| `--accent-amber` | Amber 500 | `#F59E0B` |
| `--accent-rose` | Rose 500 | `#F43F5E` |

#### Brand greens (in `tailwind.config.js`)

| Token | Hex | Notes |
|-------|-----|-------|
| `accent` | `#34D399` | Emerald 400 — replaces neon `#00FF00` |
| `sage` | `#5C7A5A` | Deeper sage for outdoor contrast |
| `medium` | `#3F7A3D` | Midtone brand green |
| `primary` | `#2F7A2C` | Darker brand green for sunlight readability |

### Where the tokens live

- CSS variables: `src/index.css` (`:root` and `.dark`)
- Tailwind aliases: `tailwind.config.js` (`textPrimary`, `bgCard`, `accentPrimary`, …)

Use the Tailwind aliases (`text-textHeading`, `bg-bgCard`, `text-accentPrimary`) in components — never hard-code hex values.

### Accessibility targets

- Body text: WCAG **AA minimum**, AAA wherever possible (light theme is AAA on all primary text tokens).
- Hint text (`--text-hint`): AA minimum, used only for genuinely tertiary info.
- Touch targets: ≥ 44 × 44 px.
- Focus rings: visible in both themes via `:focus-visible`.

---

## Performance Notes

The dashboard load path was tightened to keep cold render under ~2 s on a typical broadband connection.

### What was done

- **Heavy-effect dep loop removed** (`src/hooks/dashboard/useDashboardState.ts`)
  Reads `farms` and `backendDevices` via refs so the data-fetch effect no longer re-fires when those arrays update. Previously the cold path triggered the effect 2–3× per load.
- **Single `Promise.all` for cold fetch**
  Overview, statistics, devices, alerts, AI insights, filtered sensors *and* the previously-serial unfiltered sensors call now run in parallel. The duplicate `/latest` fallback chain was reduced to one call against the best available id.
- **Polling isolated**
  The 10-minute refresh lives in its own effect keyed on `selectedFarmId`, so the timer is no longer torn down on every dashboard re-render.
- **Heaviest section is lazy-loaded**
  `SensorCategoriesSection` is `React.lazy`'d in `src/pages/dashboard/DashboardPage.tsx` with a sized skeleton fallback (`content-visibility: auto` + `contain-intrinsic-size`).
- **LCP image hints**
  The hero device image in `RadialDeviceLayout.tsx` carries `loading="eager"`, `decoding="async"`, and `fetchpriority="high"` so the browser prioritises it during initial paint.

### What did **not** change

- API endpoint URLs and request/response shapes are byte-identical. No file under `src/api/` was modified.
- Component public props and route paths are unchanged.
