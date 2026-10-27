# Demo video pipeline (project standard)

Reference method: [知乎 · Claude Opus 一句话出片教程](https://zhuanlan.zhihu.com/p/2089616300544993151).

## Core idea

Claude / agents do **not** emit pixels. They emit **code**.

1. Write a deterministic HTML composition where every frame is a pure function of time (`seek(t)` / GSAP paused timeline / HyperFrames `hf-seek`).
2. Headless Chromium seeks frame-by-frame (`t = frameIndex / fps`) and captures pixels.
3. FFmpeg (via HyperFrames) encodes the frames (+ optional audio) to MP4.

Same HTML → same video. No wall-clock `requestAnimationFrame` for the final cut.

## Preferred stack (short promos ≤ ~90s)

| Step | Tool |
|------|------|
| Author | Single (or nested) HTML + GSAP `{ paused: true }` registered on `window.__timelines` |
| Preview / lint | `npx hyperframes preview` · `npx hyperframes lint` · `npx hyperframes snapshot` |
| Render | `npx hyperframes render -o …` (Node **≥ 22**, FFmpeg, Chrome / chrome-headless-shell) |
| Audio | Optional WAV/MP3 on an `<audio data-start data-duration>` clip; or Python-synthesized bed synced to scene cuts |

Longer / heavily componentized films may use Remotion; default for Receipt-Native promos is **HyperFrames**.

## Project layout

```
demo-video/
  PIPELINE.md          ← this file
  DEMO_VIDEO.md        ← how to re-render the current cut
  shots/               ← real product UI captures
  hyperframes/         ← HyperFrames project (index.html + assets)
    index.html
    assets/{glass_*.png,verify_*.png,bed.wav}
    snapshots/         ← QA stills
```

## Do / don’t

- **Do** drive motion from seekable timelines; use real product screenshots for glass / verify.
- **Do** keep `deliver:draft` messaging: local draft only, no real IM send.
- **Don’t** rebuild promos as static PIL/slideshow concatenations (legacy `rebuild_with_shots.py`).
- **Don’t** use HeyGen avatar / `GenerateVideo` for the default Receipt-Native product cut unless explicitly requested.
