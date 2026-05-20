# 06 Export

The send-it screen. Pick format and aspect ratio, send to one or more destinations.

**Maps to issue:** out of scope for sprint 2 per the lead's call. Reserved mount point `export-root` per the interface contract.

## Design intent

Format, aspect ratio, multi-destination including team libraries. Memebro auto-saves the original to the user's library.

- Aspect ratio per platform, the user picks where it is going
- Team-library save is a first-class destination, not an afterthought

## Mobile layout

Top to bottom:

1. Top bar with hamburger, layers icon, "export" label, conjure button
2. "← Back to editor" link
3. "Ready to send it" header (Instrument Serif italic for "send it")
4. Sub: "Pick a format + destination. Memebro auto-saves the original to your library."
5. Preview card: meme thumbnail with dimensions, format, file size, "Auto-saved to your library" check
6. FORMAT chip row: PNG, JPG, WEBP, GIF, MP4
7. ASPECT RATIO chip row: 1:1, 4:5, 9:16, 16:9, Custom
8. Footer with bottom tab bar

## Desktop layout

Two-region within main: preview on left, controls on right.

- Top bar: breadcrumb (memebro / editor / export), conjure button
- Left: large preview card with dimensions, format, file size, auto-saved check
- Right: FORMAT chips, ASPECT RATIO chips, SEND TO section with orange "Download save to device" (⌘S), "Copy to clipboard" (⌘C), "Copy shareable link memebro.app/m/x8k2", "Post to Twitter", "Send to Discord" buttons

## Key interactions

- Pick a format, the preview updates dimensions and file size
- Pick aspect ratio, the preview crops accordingly
- Hit Download, save file
- Hit Copy to clipboard, copy the image
- Hit Copy shareable link, copy a short URL
- Hit Post to Twitter / Discord, open the share flow

## Sprint 2 note

Do not build this screen this sprint. Reserve the mount point. The "Download" path is the only one we are committing to for the MVP, the social share buttons are aspirational.
