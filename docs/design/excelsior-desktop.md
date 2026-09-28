# EXCELSIOR desktop concept

The default desktop follows the supplied outline UI image and AuraOS HTML layout: a mist-to-sand rounded canvas, centered search capsule, two app rails, a larger center workspace between perspective side panels, and a bottom assistant composer.

The reference controls are adapted to EXCELSIOR's installed apps. No third-party application integrations, system metrics, example files, playback, or AI responses are simulated.

- Side rails launch native apps and indicate running apps.
- Search uses the existing Spotlight dialog. Ctrl/Cmd+K opens it from the desktop; the existing Alt+Space shortcut remains available everywhere.
- Documents opens Finder. New document, canvas, music, and settings open their existing apps.
- The Apps tab exposes the application catalog (excluding the administrative app).
- The right panel lists real open windows and restores minimized windows.
- The home control minimizes windows without closing documents.
- The assistant composer passes a draft to Chats using its existing prefill contract. The user reviews and sends it there; existing backend configuration and authentication requirements apply.
- Classic desktop restores the original wallpaper, desktop icons, and file drop behavior. The selection persists locally; the EXCELSIOR desktop button switches back.
- App windows retain their existing menu bars, window controls, and dock. The new styling is scoped to the desktop shell.

## Responsive layout

Three panels on desktop, two on tablets, and the center workspace on narrow screens. On phones the two app rails become horizontally scrollable strips above the composer. Short desktop viewports scroll vertically so the composer cannot cover the workspace.

## Validation

- `bun run typecheck`: passed.
- ESLint for the changed TSX files: passed.
- `bun run build`: passed, including service-worker/precache inspection.
- Production screenshots reviewed at 1440 × 900 and 390 × 844; no horizontal overflow at either size.
- Backend AI responses were not tested; this change uses the existing Chats integration.
