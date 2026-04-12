# Yusuf Badar — Personal Website

A minimal, high-craft portfolio site built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just clean code, intentional motion, and sharp design.

**Live:** [[yusufbadar.com](https://personal-website-nine-pi-16.vercel.app/)]([https://yusufbadar.com](https://personal-website-nine-pi-16.vercel.app/))

## Features

- **Loader sequence** — Animated SVG bars that morph into initials, then reveal the page with staggered entrance animations.
- **Interactive flow field** — Pointer-reactive canvas in the hero that responds to mouse movement with sine-wave distortion.
- **Monte Carlo visualizations** — 2D stochastic path simulation and a rotating 3D wireframe surface, both rendered on canvas with theme-aware coloring.
- **Timeline canvas** — Animated horizontal lines in the Experience section that draw in on scroll.
- **Scroll-driven reveals** — Every section fades and slides in via IntersectionObserver, with counter animations for key metrics.
- **Light / dark mode** — Full theme toggle with localStorage persistence. Every element, canvas, and animation adapts.
- **Magnetic interactions** — Buttons and links subtly follow the cursor on hover.
- **Parallax depth** — Principle cards shift on scroll based on `data-depth` attributes.
- **Reduced motion support** — All animations and transitions are disabled when `prefers-reduced-motion` is set.
- **Responsive** — Fully adaptive from 4K down to 320px mobile.

## Stack

| Layer | Tech |
|-------|------|
| Markup | Semantic HTML5 |
| Styling | Custom CSS (no preprocessor) with CSS variables for theming |
| Animation | [anime.js](https://animejs.com/) + vanilla Canvas API |
| Fonts | Plus Jakarta Sans, Syne, IBM Plex Mono (Google Fonts) |
| Hosting | Static — deploy anywhere (Vercel, Netlify, GitHub Pages) |

## Project Structure

```
├── index.html      # Single-page markup
├── styles.css      # All styles, theming, and responsive rules
├── script.js       # Loader, animations, canvas renderers, scroll logic
└── README.md
```

## License

MIT
