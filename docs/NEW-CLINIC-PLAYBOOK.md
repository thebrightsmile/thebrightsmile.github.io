# Playbook: launching a new clinic site from this template

Each clinic gets its own free GitHub **organization** named after the clinic, so the site lives at
`https://<org>.github.io/` with no personal name in the address. The printed calling card's QR code
points at that address, so **choose the organization name before anything is printed**.

Estimated time per clinic: ~15 minutes of setup by the owner, 1–2 hours of build work by Claude.

---

## Part A — Owner's setup steps (GitHub UI, once per clinic)

1. **Create the organization.** https://github.com/organizations/plan → *Create a free organization*.
   Name = the clinic's web name, lowercase, no spaces (e.g. `brightsmiledental`). Must be unused on GitHub.
2. **Create the repository inside it.** Name it exactly `<org>.github.io` (e.g. `brightsmiledental.github.io`),
   **Public**, no README (leave it empty).
3. **Install the Claude GitHub App on the organization** so Claude can push:
   https://github.com/apps/claude/installations/select_target → choose the new organization → select the repo.
4. **Enable Pages.** In the new repo: Settings → Pages → *Build and deployment* → Source: **GitHub Actions**.
5. **Start a Claude session with the template repository attached** (this one), and give Claude
   the intake details from Part C plus the organization name. Claude attaches the new repo with `add_repo`.

## Part B — Claude's build steps

1. `add_repo` the new `<org>/<org>.github.io` with push access. Clone the template into a fresh
   directory, point its `origin` at the new repo, push `main` once so the repo is not empty
   (the first deploy may fail until Part A step 4 is done; that is expected).
2. On a branch, customise:
   - `src/data/clinic.ts` — every field, including `timeZone`, hours, services and prices.
   - `src/styles/global.css` `:root` tokens — the client's colour scheme (keep contrast readable:
     dark text ≥ 4.5:1 on backgrounds).
   - `src/components/Logo.tsx` + `public/favicon.svg` — a logo concept that fits the clinic name.
   - `src/assets/doctor-portrait.jpg` — process the client photo: crop 4:5 (640 × 800), plain
     background. Do **not** commit the original photo.
   - `src/components/Hero.tsx`, `About.tsx` — headline, copy, stats, values; vary layout/wording so
     sites built for classmates do not look identical.
   - `index.html` — title and meta description.
   - `tools/calling-card/card.json` — mirror the data; `siteUrl` = `https://<org>.github.io/`.
3. Validate: `npm run build`; headless Chromium at 1366 px and 390 px: no console errors,
   no failed requests, no horizontal overflow, booking flow works, nav highlight follows scroll.
4. Open a PR to `main`; after the owner merges, confirm the deploy via the GitHub API
   (workflow run conclusion + `github-pages` deployment status = success).
5. `npm run card` and `npm run card:bleed`; the script decodes the QR and fails if it does not match
   `siteUrl`. Send the files from `tools/calling-card/out/` to the owner directly. Never commit them.

## Part C — Intake form (collect from each client)

- Full name, designation (e.g. DMD), role line
- Contact number (PH mobile) and professional email
- Clinic name, short name (for the logo lockup), address, time zone
- Founding month/year
- Opening hours per weekday, lunch break
- Services with peso prices and durations (or "use the template list")
- Colour scheme (two main colours) and logo idea / symbol preference
- Portrait photo (plain background, head and shoulders)
- Desired organization name + one backup

## Part D — Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Deploy fails at "Configure Pages": *Resource not accessible by integration* | Pages not enabled yet → Part A step 4, then re-run the failed job |
| Push refused: *Claude doesn't have GitHub access … for your organization* | Claude GitHub App not installed on that org → Part A step 3 |
| Site shows old content after a deploy | Pages caches ~10 min → hard refresh (Ctrl+F5 / Cmd+Shift+R) |
| Styles/fonts missing on the live site | Repo not named `<org>.github.io` and base path wrong → check the "Resolve site base path" step in the workflow log |
| QR scan opens the wrong page | `siteUrl` in `tools/calling-card/card.json` does not match the live address |
