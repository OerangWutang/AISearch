# TrialGuard (MVP)

TrialGuard is a privacy-first MV3 browser extension that detects likely trial/subscription checkouts before transaction completion, then helps users set cancel reminders and find manage/cancel paths.

## Privacy Statement

- Detection runs locally in the browser.
- No bank/email access.
- No page content is uploaded.
- No remote API calls in MVP.
- Stored data is limited to domain metadata and reminder configuration.

## Stored Data

- `tg_schema_version`
- `tg_settings`
- `tg_reminders`
- `tg_detections_recent` (ring buffer, max 50)
- `tg_darkpatterns_base`
- `tg_darkpatterns_user`
- `tg_user_reports`
- `tg_notification_map` (TTL map for notification action routing)

## Build

1. Install dependencies:

```bash
npm install
```

2. Build production manifest (optional host permission model):

```bash
npm run build
```

3. Build dev manifest (`<all_urls>` host permission):

```bash
npm run build:dev
```

4. Load unpacked extension from `dist/` in Chrome/Edge.

## Public vs Dev Manifests

- `npm run build` copies `manifest.json` to `dist/manifest.json`.
- `npm run build:dev` copies `manifest.dev.json` to `dist/manifest.json`.

## Permission Onboarding

- On install/update, if `requestAllSitesOnStartup` is enabled, Options opens automatically.
- Click **Enable on all sites** to grant `optional_host_permissions` for `<all_urls>`.
- If declined, popup/options still work, but detection is inactive.

## Core Features

- Heuristic trial/subscription detection with confidence scoring.
- SPA-aware rescans (`pushState`, `replaceState`, `popstate`).
- Just-in-time overlay on likely commit actions.
- Reminder scheduling via `chrome.alarms` + `chrome.notifications`.
- ICS export for reminder events.
- Local dark-pattern hints (`difficulty`, `method`, `steps`, `manageUrl`).
- Local report capture for cancellation difficulty.
- Debug HUD (`debugOverlay`) for detection tuning.

## Manual Acceptance Tests

1. Open a mock checkout page containing `14 days free trial then $9.99/month`.
2. Confirm detection result reaches high confidence and appears in debug HUD when enabled.
3. Click a commit button (`Start trial`, `Subscribe`, etc.) and verify overlay appears before navigation.
4. Dismiss overlay and verify interceptor disarms after timeout/dismiss behavior.
5. Add reminder and verify an alarm is scheduled.
6. Trigger alarm time (or dev fast-track) and verify notification appears.
7. Click notification body/button and verify destination tab opens (site/manage link).
8. Download ICS and verify event fields (`UID`, `DTSTAMP`, `DTSTART`, `SUMMARY`, optional `URL`).
9. Verify ring buffer keeps only last 50 detections.
10. Disable domain and verify detection overlay no longer appears there.
11. Export/import local data and verify settings/reminders are restored with migration-safe keys.

## Known MVP Limitations

- `domainKey` is best-effort registrable-domain parsing and may be imperfect for some TLD edge cases.
- Google Calendar OAuth integration is intentionally stubbed (not implemented).
