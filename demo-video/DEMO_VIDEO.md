# Re-render `receipt-native-demo.mp4`

Composition: [`hyperframes/`](./hyperframes/) (HyperFrames 0.8.x).  
Storyboard: [`../docs/demo-script.md`](../docs/demo-script.md).  
Pipeline standard: [`PIPELINE.md`](./PIPELINE.md).

## Requirements

- Node.js **≥ 22**
- FFmpeg + ffprobe
- Chrome or `chrome-headless-shell` (recommended)

```bash
# optional: local Node 22
export PATH="$HOME/.local/node-v22/bin:$PATH"

cd demo-video/hyperframes
npm install

# optional faster capture path
export HYPERFRAMES_BROWSER_PATH="$(pwd)/chrome-headless-shell/linux-*/chrome-headless-shell-linux64/chrome-headless-shell"

# regenerate beat bed (68s, 120 BPM) if needed
python3 assets/synth_bed.py

npx hyperframes lint
npx hyperframes snapshot --at 2,12,25,40,50,58,65 --no-end -o ./snapshots
npx hyperframes render --fps 30 --quality looks -o ../receipt-native-demo.mp4
```

## Cut summary

| Time | Beat |
|------|------|
| 0–9s | Hook claim + signed receipt card |
| 9–21s | Terminal `npm run demo` → GREEN |
| 21–33s | Glass timeline (real `glass_timeline.png`) |
| 33–45s | Expand + verify GREEN (real screenshots) |
| 45–55s | Forge RED contrast |
| 55–62s | `deliver:draft` local outbox only |
| 62–68s | End card → `github.com/ningyanhui/receipt-native` |

Duration **68s**, **1920×1080**, **30 fps**, ~**8.4 MB**, mono bed from `assets/bed.wav` (muxed by HyperFrames).
