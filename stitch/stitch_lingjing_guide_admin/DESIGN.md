---
name: Língjìng Essence
colors:
  surface: '#fbfbe2'
  surface-dim: '#dbdcc3'
  surface-bright: '#fbfbe2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f5dc'
  surface-container: '#efefd7'
  surface-container-high: '#eaead1'
  surface-container-highest: '#e4e4cc'
  on-surface: '#1b1d0e'
  on-surface-variant: '#5a403e'
  inverse-surface: '#303221'
  inverse-on-surface: '#f2f2d9'
  outline: '#8e706d'
  outline-variant: '#e2beba'
  surface-tint: '#b52424'
  primary: '#8f000d'
  on-primary: '#ffffff'
  primary-container: '#b22222'
  on-primary-container: '#ffc8c2'
  inverse-primary: '#ffb4ac'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#92030f'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fbfbe2'
  on-background: '#1b1d0e'
  surface-variant: '#e4e4cc'
  ink-deep: '#1A1A1A'
  paper-silk: '#FAF9F6'
  cinnabar-light: '#E55B5B'
  gold-leaf: '#C5A028'
  shale-gray: '#666666'
typography:
  display-lg:
    fontFamily: notoSerif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: notoSerif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: notoSerif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: notoSerif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: workSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: workSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-num:
    fontFamily: workSans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  max-width: 1440px
---

## Brand & Style

The design system embodies the "Língjìng Guide" (灵境导游) philosophy—a bridge between ancient cultural wisdom and modern digital precision. The brand personality is **Cultural, Zen-like, Trustworthy, and Data-driven**. It seeks to evoke a sense of calm, scholarly authority, and modern efficiency.

The chosen style is a synthesis of **Minimalism** and **Modern Chinese "Ink and Wash" (水墨绢本)**. This approach utilizes generous white space (mimicking silk canvas), precise typography, and subtle textural depth. While the aesthetic is rooted in traditional art, the functional structure follows a **Corporate/Modern** logic to ensure the management backend remains professional and data-rich.

**Key visual principles:**
- **Asymmetry and Balance:** Use "Empty Space" (留白) to prevent cognitive overload in data-heavy views.
- **Textural Depth:** Subtle silk/paper textures replace standard flat backgrounds to provide a premium, tactile feel.
- **Precision meets Fluidity:** Rigid grid structures are softened by fluid iconography and organic cinnabar accents.

## Colors

The palette is derived from the "Cinnabar and Ink" tradition. 

- **Primary (Cinnabar Red):** Used strictly for high-priority actions, critical status indicators, and brand accents. It represents vitality and the seal of authority.
- **Secondary (Ink Black):** The primary color for text, borders, and structural lines, providing high legibility and a grounding force.
- **Tertiary (Subtle Gold):** Reserved for "premium" highlights, such as top-performing analytics or featured knowledge base entries.
- **Neutral (Paper White/Silk):** The foundation of the UI. It is not a pure white but a warm, slightly textured off-white that reduces eye strain and reinforces the "scroll" aesthetic.

**Color Mode:** Primarily `light` to maintain the ink-on-paper metaphor. Dark mode should be implemented as a high-contrast "Inverted Ink" theme if required.

## Typography

The typography system creates a hierarchy between "The Narrative" and "The Data."

- **Headlines (Noto Serif):** Used for titles and section headers. The serif nature echoes traditional Chinese woodblock printing, lending an air of authority and cultural depth.
- **Body & Data (Work Sans):** A clean, professional sans-serif used for all management tasks, forms, and descriptive text. It ensures clarity in complex tables.
- **Labels & Code (JetBrains Mono):** Used for metadata, status tags, and technical identifiers to provide a modern, "digital-first" contrast to the organic serif headings.

**Scaling:** For mobile devices, large display fonts are reduced to a maximum of 24px to ensure readability without excessive scrolling.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for the management desktop, centered at 1440px, transitioning to a **Fluid Grid** for mobile viewports. 

- **Desktop Rhythm:** A 12-column grid with 24px gutters. Dashboard cards typically span 3, 4, or 6 columns. 
- **Content Flow:** Horizontal sections are separated by large "Zen" margins (40px+) to maintain the minimalist aesthetic.
- **Reflow Rules:** On tablet, the 12 columns collapse to 8. On mobile, elements stack vertically into a single column with 16px side margins.

Spacing follows an 8px base unit. Use larger increments (32px, 48px, 64px) for section headers to emphasize the "Ink and Wash" layout's openness.

## Elevation & Depth

To maintain the "Silk Canvas" feel, the system avoids heavy, artificial shadows. Instead, it uses **Tonal Layers** and **Subtle Outlines**.

- **Surfaces:** The base layer is `paper-silk`. Active containers (cards, modals) are elevated using a thin 1px border in `secondary_color` at 10% opacity.
- **Tonal Depth:** Hover states use a very soft, tinted wash of `tertiary_color` (Gold) at 5% opacity rather than a shadow.
- **Selective Focus:** When a modal or dialog is active, the background is darkened using an "Ink Wash" overlay—a 40% opacity `ink-deep` fill.
- **Charts:** Sentiment analysis and data charts should use flat, solid fills or subtle vertical gradients, avoiding 3D effects.

## Shapes

The shape language is **Soft (0.25rem)**. 

While the "Ink and Wash" style often features organic, flowing lines, the management backend requires structural integrity. We use slightly softened corners to prevent the UI from feeling too "aggressive" or "industrial," while maintaining the professional precision of a data-driven tool. 

- **Standard Elements:** 4px (0.25rem) radius for buttons and input fields.
- **Large Containers:** 8px (0.5rem) radius for dashboard cards and knowledge base list containers.
- **Circular Elements:** Avatars and "status pips" remain perfectly circular to represent the "Zen" circle (Enso).

## Components

**Buttons:**
- **Primary:** Solid `cinnabar-red` with `paper-silk` text. No shadow; 4px radius.
- **Secondary:** Ghost style with `ink-black` 1px border. 
- **Actionable Icons:** Minimalist line-art icons in `ink-black`.

**Cards (Dashboard Stats):**
- Background is a clean `paper-silk`.
- Use `notoSerif` for the metric title and `workSans` (Data-num) for the value.
- Include a subtle 2px vertical "ink stroke" on the left side of the card in `cinnabar-red` for active metrics.

**List Views (Knowledge Base):**
- High-density rows with 1px `ink-black` (10% opacity) bottom separators.
- Toggle switches for "Enable/Disable" should use the `cinnabar-red` when active.

**Form Elements (Avatar Config):**
- Inputs are underlined (traditional calligraphy style) or fully bordered with a 1px `ink-black` at 15% opacity.
- Focused state changes the border to `cinnabar-red`.

**Charts (Sentiment Analysis):**
- Use a palette of desaturated "mineral" colors (Slate, Ochre, Sage) alongside `cinnabar-red` for negative sentiments and `gold-leaf` for positive ones.
- Lines should have a "hand-drawn" slight smoothness to mimic brush strokes.