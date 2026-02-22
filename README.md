# ArboNova 宇豆樹科技 — Official Website

> 為企業打造專屬 AI Agent 團隊，釋放無限可能。

🌐 **Live Site:** [https://wulingteen.github.io/arbonova-website/](https://wulingteen.github.io/arbonova-website/)

---

## 設計美學

This website blends three distinct design philosophies:

- **Wabi-Sabi** — Natural earth tones, imperfect textures, deliberate restraint
- **Brutalism** — Thick borders, hard shadows, raw typographic presence
- **Apple HIG** — Smooth squircle corners, refined micro-animations, premium feel

The result is a **Soft Organic Brutalism** — a statement aesthetic that feels both raw and refined.

---

## 特色功能

| Feature | Description |
|---|---|
| 🎬 **AI Network Splash** | Full-screen canvas: geometric nodes (circle, triangle, diamond, hexagon, square) grow outward from center in 14 waves, connected by animated colored lines — visualizing AI agent collaboration |
| 🌿 **Particle Background** | Wabi-Sabi styled particle network in the Hero section, representing real-time AI collaboration |
| 📐 **2×2 Features Grid** | Cards with oversize numbered accents (01–04), tech-tag pills, and brand-color hover fills |
| 📱 **Fully Responsive** | Designed for desktop, tablet, and mobile |
| ⚡ **Ultra Fast** | Vanilla CSS + TypeScript, zero frameworks — 7.5 KB JS gzipped |

---

## Tech Stack

| Category | Technology |
|---|---|
| Build Tool | [Vite](https://vitejs.dev/) 7.3 |
| Language | TypeScript + Vanilla CSS |
| Fonts | Inter + Noto Sans TC (Google Fonts) |
| Animation | Canvas API + CSS Keyframes + Intersection Observer |
| Deployment | GitHub Pages via `gh-pages` |

---

## 快速開始

```bash
# Clone the repo
git clone https://github.com/wulingteen/arbonova-website.git
cd arbonova-website

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173/

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 設計色彩系統

| Name | Hex | Usage |
|---|---|---|
| Linen White | `#F5F2ED` | Background |
| Light Concrete | `#E8E4DC` | Secondary background |
| Charcoal Black | `#1A1A1A` | Text, borders, nodes |
| Earth Bronze | `#AA713E` | Accent, interactive lines |
| Ivy Green | `#32653A` | Primary CTA, accents |

---

## 專案結構

```
arbonova-website/
├── index.html          ← Full HTML (7 sections)
├── vite.config.ts      ← Vite config with GitHub Pages base path
├── src/
│   ├── style.css       ← Design system + component styles
│   └── main.ts         ← Canvas animations + interactions
└── public/
    └── favicon.svg
```

---

## License

© 2025 宇豆樹科技 ArboNova Co., Ltd. All rights reserved.
