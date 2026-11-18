# Deployment — LINE G99 Pawn Payment App

Production: **https://g99pawnpay-customer.golden99.co.th**
served by nginx from `/var/www/g99pawnpay-customer/html` on `file.drugnetcenter.com`.

Deploys run from the [Jenkinsfile](Jenkinsfile), a Jenkins **Multibranch Pipeline** on agent `apd.local`
(same setup as `g99analytic`). Nobody builds or `scp`s from a laptop any more.

## How to release

```
feature branch ──PR──▶ dev ──PR──▶ prod   (merging into prod deploys)
```

| Branch | What Jenkins does |
|---|---|
| any branch / PR | `npm ci` → `npm test -- --run` → `npm run build`, archive `dist/` |
| `prod` | the same, then **deploy** to production |

There is no approval gate: **pushing to `prod` deploys.** A failing test stops the build before anything is uploaded.

## What the deploy does

1. Upload `dist/*` to `html.new` on the server (`px@file.drugnetcenter.com:5333`, Jenkins credential `px-file-drugnetcenter`).
2. `chmod -R a+rX` so nginx (`www-data`) can read it.
3. Swap: `html` → `html.bak`, `html.new` → `html`. The previous release stays in `html.bak`.

## Rollback

On the server:

```bash
cd /var/www/g99pawnpay-customer && mv html html.broken && mv html.bak html
```

Only one previous release is kept. To go further back, revert the commit on `prod` and push; Jenkins redeploys it.
Every build's `dist/` is also archived in Jenkins (last 15 builds).

## Build-time configuration

Vite bakes `VITE_*` variables into the bundle at build time. The production values are **not in git**: they are
the Jenkins credential **`line-g99-paid-pawn-env-prod`** (kind *Secret file*), a normal `.env` file. The pipeline
copies it to `.env.production.local` for the build, checks the four keys below are set, and deletes it afterwards.
Every branch builds with it, so every archived `dist/` is a real prod build.

| Variable | Used for |
|---|---|
| `VITE_LIFF_ID` | LINE LIFF app id (`liff.init`) |
| `VITE_BASE_URL` | pawn-online-api base URL |
| `VITE_SURVEY_API_URL` | post-visit survey API |
| `VITE_APP_VERSION` | version shown on the splash screen; bump it when releasing |

To change a value (e.g. bump `VITE_APP_VERSION`): Jenkins → Manage Jenkins → Credentials →
`line-g99-paid-pawn-env-prod` → Update → upload the new file, then re-run the `prod` build. Keys and example values
are in [.env.example](.env.example).

Everything in that file still ends up in public JavaScript, so keeping it in Jenkins keeps it out of git but does
not make it secret. **Never put a real secret in it.** Local development uses your own gitignored `.env`.

## One-time setup

- **Jenkins:** create a Multibranch Pipeline for `pongsathonwon/line-g99-paid-pawn` (script path `Jenkinsfile`),
  in the same folder and with the same GitHub credential as `g99analytic`. It reuses the existing
  `px-file-drugnetcenter` SSH key credential.
- **Jenkins credential:** add a *Secret file* credential with ID `line-g99-paid-pawn-env-prod`, uploading the prod
  `.env` (`VITE_LIFF_ID`, `VITE_BASE_URL`, `VITE_SURVEY_API_URL`, `VITE_APP_VERSION`). Every build fails until it exists.
- **Server:** user `px` must own the **parent** folder `/var/www/g99pawnpay-customer/`, otherwise the
  `mv html html.bak` swap fails with `Permission denied`. Check with `ls -ld /var/www/g99pawnpay-customer`.

## After deploying

- Open the app from LINE on a phone: LIFF login, then the payment flow.
- If the LIFF endpoint URL ever changes, update it in the [LINE Developers Console](https://developers.line.biz/console/).

## History

The app was first a POC on Vercel (`vercel.json`, `@vercel/speed-insights`). Production then moved to
`file.drugnetcenter.com`, deployed by hand with `deploy.sh` / `deploy.ps1` (local, gitignored), which the
pipeline replaces.
