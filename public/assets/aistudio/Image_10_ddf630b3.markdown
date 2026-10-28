---
name: DevPilot Design System
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bec8d2'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#88929b'
  outline-variant: '#3e4850'
  surface-tint: '#89ceff'
  primary: '#89ceff'
  on-primary: '#00344d'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#006591'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#d88a00'
  on-tertiary-container: '#4a2c00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
    letterSpacing: -0.01em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for elite software developers, platform engineers, and AI operator teams managing complex autonomous code engines and deployment pipelines on touch-first viewports. The emotional response is one of surgical precision, high agency, computational trust, and calm under operational stress.

The aesthetic fuses **Precision Developer Modernism** with **Functional Glassmorphism**:
- Ultra-deep slate and obsidian surfaces emulate low-light terminal environments while minimizing battery draw and visual fatigue.
- Signal accents (cyan, emerald, amber, ruby) are deployed strictly for informational telemetry, diff validation, and status attribution rather than decorative noise.
- Translucent backdrop layers and micro-borders establish a crisp architectural hierarchy suited for dense diagnostic streams, branch graphs, and patch reviews.

## Colors

The palette operates in strict dark mode by default, built on a chromatic ladder of cool slates and calibrated status signals.

### Surface Tiers
- **Canvas / Root Background**: `#0B0F17` (Deep Obsidian Void)
- **Surface Level 1 (Card & Shell Base)**: `#111827` (Charcoal Slate)
- **Surface Level 2 (Elevated & Modals)**: `#1E293B` (Mid Slate)
- **Surface Level 3 (Input & Interactive Fills)**: `#334155` (Soft Slate)

### Chromatic Signals & Accents
- **Primary (Electric Cyan)**: `#0EA5E9` (Interactive controls, active telemetry, agent prompts). High-emphasis hover/focus uses `#38BDF8`.
- **Secondary (Vibrant Emerald)**: `#10B981` (Passing checks, merged branches, automated patch verified).
- **Warning / In-Flight (Amber)**: `#F59E0B` (AI synthesis running, review required, pending commit).
- **Destructive / Error (Ruby)**: `#EF4444` (Build breakage, diff removals, agent halt).

### Text & Border Tokens
- **Foreground High Contrast**: `#F8FAFC`
- **Foreground Muted / Body**: `#94A3B8`
- **Foreground Monospace / Code Token**: `#CBD5E1`
- **Border Subtle**: `rgba(255, 255, 255, 0.08)`
- **Border Focus / Active State**: `rgba(14, 165, 233, 0.6)`

## Typography

The typographic hierarchy establishes clear separation between human language, interface telemetry, and executable code.

- **Headlines (`Plus Jakarta Sans`)**: Delivers geometric structure and high-modern legibility without decorative quirkiness. Tight tracking (`-0.02em` to `-0.03em`) maintains cohesion in compact mobile headers.
- **Body (`Inter`)**: Neutral, highly legible workhorse optimized for multi-line agent reasoning, review comments, and operational documentation.
- **Monospace & Telemetry (`JetBrains Mono`)**: Dedicated to commit hashes, diff line counts, syntax blocks, parameters, and status indicators. Line-height is adjusted to prevent vertical jitter in split-screen patch previews.
- **Rendering Directives**: Font smoothing must remain `-webkit-font-smoothing: antialiased`. Code blocks must enforce tabular numerals (`tnum`) and zero slash ligatures.

## Layout & Spacing

The layout is built upon an 8pt base grid with a fluid column framework configured for handheld touch manipulation and side-by-side terminal telemetry:

- **Mobile (<768px)**: 4-column fluid layout with `1rem` margins and `1rem` gutters. Elements snap edge-to-edge for diff windows and code canvases with bottom-anchored thumb zones.
- **Tablet (768px - 1024px)**: 8-column layout with `1.5rem` margins. Split view enabled for Agent Prompt Log (left) and Live Workspace/Diff (right).
- **Desktop (>=1024px)**: 12-column layout max-width constrained to `1440px`, with persistent collapsable agent sidebar and floating inspect panels.

Spacing adheres strictly to data density tokens: micro-elements inside code badges use `space-xs` (4px), inner-card padding relies on `space-md` (12px) to `space-lg` (16px), while contextual flow groups separate at `space-xl` (24px).

## Elevation & Depth

Visual hierarchy does not rely on opaque dropshadows. Depth is articulated through **tonal glass layering**, **subtle specular micro-borders**, and **chromatic ambient glows**:

- **Layer 0 (Canvas)**: Solid `#0B0F17` background with subtle grid overlay (`rgba(255, 255, 255, 0.02)` 24px mesh).
- **Layer 1 (Cards, Code Blocks)**: `#111827` background at `85%` opacity with `backdrop-filter: blur(12px)` and a continuous `1px` border of `rgba(255, 255, 255, 0.08)`.
- **Layer 2 (Overlays, Drawers, Floating Command Bars)**: `#1E293B` at `90%` opacity with `backdrop-filter: blur(20px)`, a `1px` border of `rgba(255, 255, 255, 0.12)`, and an ambient shadow: `0 8px 32px -4px rgba(0, 0, 0, 0.6)`.
- **Active Agent Glow**: Focused or processing surfaces project a diffuse, zero-spread luminescent radiance: `0 0 16px rgba(14, 165, 233, 0.15)`. Critical failure panels project `0 0 16px rgba(239, 68, 68, 0.15)`.

## Shapes

The interface embraces a compact, technical **Soft** curvature (`roundedness: 1`):

- **Default UI Containers & Buttons**: `0.25rem` (4px) to preserve terminal-like architectural firmness.
- **Cards, Code Containers, Bottom Sheets**: `rounded-lg` (`0.5rem` / 8px).
- **Status Pills, Commits, and Counter Badges**: `0.25rem` or full-pill token (`9999px`) reserved specifically for non-actionable status metadata.
- **Focus Rings**: Strict 1px offset with 1.5px solid stroke mirroring the accent color of the action.

## Components

### Buttons & Interactive Triggers
- **Primary Action (Run / Apply Diff)**: Gradient-infused cyan fill (`#0EA5E9` to `#0284C7`), dark slate label (`#0B0F17`), weight 600. Height 40px on mobile for finger-target ergonomics.
- **Secondary Action (Inspect / Terminal)**: Surface `#1E293B`, `1px` border `rgba(255, 255, 255, 0.12)`, text `#F8FAFC`.
- **Ghost / Code Copy**: Zero-fill, text `#94A3B8`, hover fill `rgba(255, 255, 255, 0.05)`.

### Code & Diff Cards
- Code previews utilize `#111827` glass card with top window bar displaying branch name and line counts.
- **Diff Additions**: Background `rgba(16, 185, 129, 0.12)`, text `#34D399`, left border accent `2px solid #10B981`.
- **Diff Deletions**: Background `rgba(239, 68, 68, 0.12)`, text `#F87171`, left border accent `2px solid #EF4444`.

### Chips & Telemetry Badges
- Constructed with `JetBrains Mono` at `10px`, uppercase with `letter-spacing: 0.06em`.
- Fills use 10% opacity tints matching status: Emerald (Healthy), Amber (Compiling), Ruby (Failed), Cyan (Agent Active). Micro-indicator dot (4px) anchored left.

### Form Inputs & Terminal Command Line
- Dark obsidian base (`#0B0F17`) with inset `1px` border (`rgba(255, 255, 255, 0.1)`).
- Leading prompt marker (`$ ` or `AI 
Hô[ô\ôY[àÃPMQNXô]úòZ[ú»[€õÀàõÿ›\»⁄Yù»õ‹ô\à»ÃŒëé⁄]Hú›]\àﬁX[à€›ÀÇÇà»»»⁄X⁄ÿõﬁ\»	àŸŸ€H€€ùõ€¬ãH‹]X\ôH⁄]åç\ô[X€‹õô\àòY]\À\ö»›õ⁄ŸK[ò⁄X⁄ŸY›]H]ôÿòJçMKçMKçMKåäXà⁄X⁄ŸY›]Hò[ú⁄][€ú»[ú›[ùH»ÃPMQNX⁄]‹ö\‹ZX‹õ»⁄X⁄€X\ö»X€€ãÇÇà»»»YŸ[ù›ôX[Z[ô»ò]Ÿ\ÇãHö^YXõ›€H›ô\õ^H€Y[ô»\⁄]Ÿ\›\ôH[àò[ú‹\ô[ùõ\àòX⁄⁄[ô»
ÃLLNçÿ]LâJKôX[][YH⁄Ÿ[àŸ[ô\ò][€à›ôX[Hô[ô\ôY[à€ŸK[Y[ô[ŸH[ôXÿ]‹à€àX›]ôH[ôô\ô[òŸHﬁX€K