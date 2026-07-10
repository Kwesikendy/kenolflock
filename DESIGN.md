# Kenol Flock Design System

This document outlines the core aesthetic and design tokens for the Kenol Flock Church Management System. Our goal is to create a premium, modern, and dynamic interface that rivals top-tier SaaS products (like Stripe or Linear).

## 1. Core Principles
- **Clarity:** The interface should feel spacious and uncluttered.
- **Vibrancy:** Use deep, harmonious colors rather than flat, basic web colors.
- **Dynamic Feedback:** Every interactive element should respond to user input (hover states, focus rings, subtle active state shifts).
- **Glassmorphism:** Use subtle translucency for overlays, dropdowns, and sticky headers to create depth.

## 2. Color Palette (CSS Variables)

We use a sleek dark/light adaptable palette. The primary theme leans into deep, rich blues and purples.

### Base Colors
- `--bg-primary`: `#FAFAFA` (Light) / `#0A0A0A` (Dark)
- `--bg-secondary`: `#FFFFFF` (Light) / `#141414` (Dark)
- `--bg-tertiary`: `#F4F4F5` (Light) / `#27272A` (Dark)

### Accent (Brand)
- `--brand-primary`: `#6366F1` (Indigo)
- `--brand-hover`: `#4F46E5`
- `--brand-active`: `#4338CA`

### Text
- `--text-primary`: `#09090B` (Light) / `#FAFAFA` (Dark)
- `--text-secondary`: `#71717A` (Light) / `#A1A1AA` (Dark)
- `--text-muted`: `#A1A1AA` (Light) / `#52525B` (Dark)

### Borders & Dividers
- `--border-subtle`: `#E4E4E7` (Light) / `#27272A` (Dark)
- `--border-focus`: `rgba(99, 102, 241, 0.5)`

## 3. Typography
- **Primary Font:** `Inter` or `Geist` (sans-serif)
- **Headings:** Bold, tightly tracked (letter-spacing: -0.02em).
- **Body:** Highly legible, comfortable line-height (1.5).

### Sizes
- `--text-xs`: `0.75rem`
- `--text-sm`: `0.875rem`
- `--text-base`: `1rem`
- `--text-lg`: `1.125rem`
- `--text-xl`: `1.25rem`
- `--text-2xl`: `1.5rem`

## 4. UI Components

### Buttons
- **Primary:** Solid background (`--brand-primary`), white text, subtle shadow. On hover: translate-y by `-1px` and lighten background.
- **Secondary:** Transparent background, subtle border, `--text-primary`. On hover: switch to `--bg-tertiary`.
- **Transitions:** `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`.

### Inputs
- Background: `--bg-secondary`
- Border: `--border-subtle`
- Focus State: Outline with `--border-focus`, no harsh browser default focus rings.

### Cards & Panels
- Background: `--bg-secondary`
- Border: 1px solid `--border-subtle`
- Shadow: Soft, diffused shadow (e.g., `0 4px 20px rgba(0, 0, 0, 0.05)` in light mode).
- Border Radius: `12px` (Soft but professional).

## 5. Micro-Animations
- **Fade Ins:** Page transitions and modally-appearing elements should fade in `opacity: 0` to `1` over `200ms` with a slight `translate-y` up.
- **Hover scaling:** Interactive icons and small buttons can scale to `1.05` on hover.

## 6. Implementation Strategy
We will NOT use Tailwind CSS. Instead, we will implement these as raw CSS variables in `globals.css` and use semantic HTML classes to apply them, maintaining absolute control over the styling and achieving the requested "premium Vanilla CSS" feel.
