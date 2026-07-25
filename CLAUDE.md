# CLAUDE.md — Gili Landing Page Preview

## Project overview

This is a standalone preview landing page for Gili, a fully managed client-retention service for hair and beauty salons. It is **completely separate** from any existing Gili website or deployment.

## Safety rules — DO NOT

- Do not connect this project to any existing Netlify site or GitHub repository
- Do not modify any DNS records or connect a custom domain
- Do not overwrite or redeploy to gili-beauty.netlify.app or any other existing Gili site
- Do not add any new pages — this is a single-page project

---

## Brand positioning

Gili is **not** software and must not be presented as such. Gili works personally with each salon to design how it stays in contact with its clients, and then carries out that communication automatically.

The core promise:
> "Du hast hart gearbeitet, um neue Kundinnen zu gewinnen. Gili sorgt dafür, dass sie wiederkommen."

Visitor takeaway: "I am not buying another tool. I am getting a personal service that builds and manages my salon's client communication for me."

**Focus on:** client retention, personal strategic guidance, implementation, ongoing support  
**Never focus on:** software, technology, features, dashboards, AI, integrations

---

## Language rules

- All visible copy: natural, polished German
- Primary audience: female salon owners (Saloninhaberinnen)
- Use feminine wording: Kundinnen, Saloninhaberinnen, Stylistinnen, Beraterinnen
- The word "automatisch" may be used sparingly
- **Never use:** AI, KI, CRM, SaaS, Workflow, Automation Platform, Integration, Marketing Automation
- **Never use:** revolutionär, bahnbrechend, game-changing, cutting-edge, transformiere dein Business
- No exclamation marks in editorial copy

---

## Brand system

| Token         | Value     | Usage                         |
|---------------|-----------|-------------------------------|
| Warm off-white | `#FAF8F4` | Page background               |
| Terracotta    | `#C4622D` | Primary accent, CTAs, logo dot |
| Near-black    | `#1A1A18` | Text, headings                |
| Muted sage    | `#A8BEB2` | Secondary accents             |
| Soft border   | `#E7E2DB` | Borders, dividers             |
| Cream         | `#F4F0E8` | Section backgrounds           |

**Fonts:**
- Headlines: DM Serif Display (Google Fonts)
- Body / UI: Instrument Sans (Google Fonts)

**Logo:** `Gili.` — lowercase, terracotta dot, DM Serif Display

---

## WhatsApp rules

- WhatsApp green may only appear inside WhatsApp-specific interface elements
- Only claim WhatsApp as the channel — no Instagram, no website chat
- Keep all channel claims consistent across the entire page

**WhatsApp UI tokens:**
```
bg:             #ECE5DD
bubbleOutgoing: #DCF8C6  (client, right)
bubbleIncoming: #FFFFFF  (salon/bot, left)
header:         #075E54
headerText:     #FFFFFF
timestamp:      #999999
```

**Booking confirmation format (always use all 5 lines):**
```
Perfekt, [Name]! ✨ [time] Uhr passt wunderbar, ich habe den Termin für dich eingetragen. 🧡
📅 [Weekday, date]
⏰ [time] Uhr
✂️ [service name]
📍 [salon name, address]
Wir freuen uns auf dich! 🌸
```

---

## Design rules

**DO:**
- Mobile-first responsive design (375px / 768px / 1440px)
- Strong typography hierarchy using DM Serif Display for headings
- Generous vertical spacing (py-24 to py-32 per section)
- Subtle borders instead of heavy shadows
- Restrained rounded corners (max rounded-2xl)
- Lucide icons where icons are needed
- Inline SVG for custom visuals
- Light scroll-reveal via IntersectionObserver
- Smooth transitions and subtle hover effects
- Semantic HTML with accessible focus states
- Respect prefers-reduced-motion

**DON'T:**
- No bright saturated gradients
- No gradient text
- No glassmorphism or heavy shadows
- No border radius larger than rounded-2xl
- No text smaller than 14px
- No fake logos, statistics, testimonials, or media coverage
- No countdown timers or artificial scarcity
- No placeholder image areas or empty mockup boxes
- No generic SaaS dashboard visuals
- No dark mode

---

## Content rules

Every section answers a distinct question. Do not repeat the same promise.

| Section              | Question it answers         |
|----------------------|-----------------------------|
| Hero                 | What is the promise?        |
| Human problem        | Why is this needed?         |
| Personal value       | Why is Gili different?      |
| Ongoing support      | What happens after setup?   |
| Client journey       | What happens over time?     |
| Mockup               | What does the client experience? |
| Signature statement  | What is the core truth?     |
| Pricing              | What does it cost?          |
| FAQ                  | What objections remain?     |

**Before finishing any edit, check:**
- No repeated promises across sections
- No repeated explanations of the personal setup
- No overuse of "automatisch"
- No technical language
- No generic filler copy

---

## Key edit points in index.html

- `const DEMO_URL = "#"` near the bottom — update to set demo booking URL
- `<!-- EDITABLE: Pricing details -->` — update pricing numbers
- `<!-- EDITABLE: Summer offer banner -->` — update or remove seasonal offer
- `<!-- EDITABLE: Contact email -->` — update if email changes
- `<!-- EDITABLE: Replace # with actual Impressum and Datenschutz URLs -->`

---

## Stack

- index.html (single file, no build step)
- Tailwind CSS: https://cdn.tailwindcss.com
- Lucide Icons: https://unpkg.com/lucide@latest/dist/umd/lucide.min.js
- Google Fonts: DM Serif Display + Instrument Sans
- Vanilla JavaScript only (no frameworks)

---

## Deployment

- New Netlify site — preview only, no custom domain
- New GitHub repository under maibarzi account
- Completely separate from all existing Gili deployments
