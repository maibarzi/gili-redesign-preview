# Gili – Production Landing Page

Production landing page for Gili, a client-retention service for hair and beauty salons.

## Stack

- Static HTML, CSS and JavaScript with no build step
- Tailwind CSS via CDN
- Lucide Icons via CDN
- Google Fonts (DM Serif Display + Instrument Sans)
- Vanilla JavaScript
- Netlify Forms for pilot registrations
- Consent-first loading for Google Analytics, Microsoft Clarity and Meta Pixel

## Deployment

Deployed through the Netlify project `gili-redesign-preview-0726`.

- Production: https://gili.live
- Netlify URL: https://gili-redesign-preview-0726.netlify.app
- Former site: https://gili-beauty.netlify.app

Tracking IDs are configured in `tracking-config.js` and load only after the
visitor grants the matching consent category.

- Google Analytics: `G-8F4KKHPGNC`
- Microsoft Clarity: `xu34q4l3em`
- Meta Pixel: `2060114271547057`

## Key edit points

- `DEMO_URL` constant near the bottom of `index.html` — update to set the demo booking link
- Pricing section is clearly labelled `<!-- EDITABLE: Pricing details -->`
- Footer email and legal links are labelled `<!-- EDITABLE -->`
- Summer offer banner is labelled `<!-- EDITABLE: Summer offer banner -->`
