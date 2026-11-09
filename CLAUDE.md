# Project guide for Claude

Dental clinic "digital calling card" website + printable calling card.
Live example: https://rashleysmiledentalclinic.github.io/ (repo `rashleysmiledentalclinic/rashleysmiledentalclinic.github.io`).
The same codebase is the **template for every new clinic site**. For a new clinic,
follow `docs/NEW-CLINIC-PLAYBOOK.md` step by step.

## Stack and commands

Vite 8 · React 19 · TypeScript (strict) · hand-written CSS tokens · self-hosted fonts. No backend.

```bash
npm install
npm run dev          # local dev server
npm run build        # typecheck + production build (must pass before any push)
npm run preview      # serve dist/ locally (default port 4173)
npm run card         # calling card: PDF + 600 DPI PNG/JPG → tools/calling-card/out/
npm run card:bleed   # same with 0.125 in bleed for commercial printing
```

## Where everything client-specific lives

| What | File |
| --- | --- |
| Clinic name, doctor, contact, address, time zone, founding date, hours, services & peso prices | `src/data/clinic.ts` |
| Colour scheme (CSS tokens) | `src/styles/global.css` (`:root` block at the top) |
| Logo (outlined tooth + plus, SVG) | `src/assets/logo.svg` and `public/favicon.svg` (keep them in sync); rendered by `src/components/Logo.tsx` |
| Doctor portrait | none supplied; `src/components/About.tsx` shows a monogram badge. To add one, drop `src/assets/doctor-portrait.jpg` (640 × 800) and swap the badge for an `<img>` |
| Hero stats, marquee items | `src/components/Hero.tsx` |
| About copy, values | `src/components/About.tsx` |
| Calling-card text, URL, colours, fonts, logo image/badge | `tools/calling-card/card.json` (must match `clinic.ts`; `fonts` are node_modules paths of the site's fonts) |
| Page `<title>`, meta description | `index.html` |

## Deployment

- `.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.
- Base path is resolved automatically: `/` for a repo named `<owner>.github.io` or with `public/CNAME`,
  otherwise `/<repo>/`.
- Pages must be enabled once per repo by a human: Settings → Pages → Source: **GitHub Actions**.
- Pages caches for ~10 minutes; a hard refresh (Ctrl+F5) shows a fresh deploy.

## Working conventions

- Work on a feature branch, open a pull request to `main`, the user merges. Each merge deploys.
- Before pushing: `npm run build` must pass, and check the page in headless Chromium
  (Playwright is preinstalled in the cloud environment; `require('playwright')` works anywhere).
- Keep the security posture: strict CSP (no inline scripts, no `data:` URIs, same-origin only),
  validated inputs, validated `localStorage` reads, no third-party requests, no secrets.
  Any new asset must be served same-origin (import it through Vite).
- **Never commit** rendered calling cards (`tools/calling-card/out/` is git-ignored) or original
  client photos. Only the processed portrait that is meant to appear on the public site is committed.
- Placeholder content is marked `DEMO` in `src/data/clinic.ts`.

## Environment gotchas (cloud sessions)

- The session's egress proxy cannot reach `*.github.io`, so verify deploys through GitHub's API
  (deployment status for the `github-pages` environment), not by fetching the live page.
- Repository *settings* writes (visibility, Pages, environments) are blocked through the proxy;
  the user does them in the GitHub UI.
- Pushing to an organization repo requires the Claude GitHub App to be installed on that
  organization: https://github.com/apps/claude/installations/select_target
