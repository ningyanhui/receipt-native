#!/usr/bin/env python3
"""Simple deterministic beat bed synced to ~68s scene cuts (120 BPM)."""
import math
import struct
import wave
from pathlib import Path

import numpy as np

SR = 44100
BPM = 120
DURATION = 68.0
BEAT = 60.0 / BPM

# Scene cut times (seconds) — hit accents
CUTS = [0.0, 9.0, 21.0, 33.0, 45.0, 55.0, 62.0, 68.0]


def env(n, attack=0.01, release=0.08):
    a = int(SR * attack)
    r = int(SR * release)
    e = np.ones(n, dtype=np.float64)
    if a > 0:
        e[:a] = np.linspace(0, 1, a, endpoint=False)
    if r > 0 and r < n:
        e[-r:] = np.linspace(1, 0, r)
    return e


def tone(freq, length, vol=0.2, wave_type="sine"):
    n = int(SR * length)
    t = np.arange(n) / SR
    if wave_type == "sine":
        s = np.sin(2 * math.pi * freq * t)
    elif wave_type == "tri":
        s = 2 * np.abs(2 * (t * freq - np.floor(t * freq + 0.5))) - 1
    else:  # soft square
        s = np.tanh(3 * np.sin(2 * math.pi * freq * t))
    return s * env(n) * vol


def kick(length=0.18, vol=0.45):
    n = int(SR * length)
    t = np.arange(n) / SR
    freq = 110 * np.exp(-t * 18) + 40
    phase = np.cumsum(2 * math.pi * freq / SR)
    s = np.sin(phase) * env(n, 0.002, 0.12)
    return s * vol


def hat(length=0.04, vol=0.08):
    n = int(SR * length)
    s = np.random.default_rng(7).uniform(-1, 1, n) * env(n, 0.001, 0.03)
    # highpass-ish: difference
    s = np.diff(s, prepend=s[0])
    return s * vol


def snare(length=0.12, vol=0.22):
    n = int(SR * length)
    noise = np.random.default_rng(3).uniform(-1, 1, n) * env(n, 0.002, 0.08)
    t = np.arange(n) / SR
    body = np.sin(2 * math.pi * 180 * t) * env(n, 0.001, 0.06) * 0.4
    return (noise * 0.7 + body) * vol


def pad_chord(freqs, length, vol=0.07):
    n = int(SR * length)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        s += np.sin(2 * math.pi * f * t) * 0.5
        s += np.sin(2 * math.pi * f * 2 * t) * 0.15
    s *= env(n, 0.4, 0.6) * vol
    return s


def place(buf, sample, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    end = min(len(buf), i + len(sample))
    buf[i:end] += sample[: end - i]


def main():
    n = int(SR * DURATION)
    buf = np.zeros(n, dtype=np.float64)
    rng = np.random.default_rng(42)

    # Soft pad beds per scene mood
    moods = [
        (0, 9, [110, 164.81, 220]),  # A minor-ish
        (9, 21, [130.81, 196, 261.63]),  # brighter
        (21, 33, [146.83, 220, 293.66]),
        (33, 45, [164.81, 246.94, 329.63]),  # green verify
        (45, 55, [123.47, 185.0, 246.94]),  # slightly tense
        (55, 62, [130.81, 196, 261.63]),
        (62, 68, [110, 164.81, 220, 329.63]),
    ]
    for a, b, freqs in moods:
        place(buf, pad_chord(freqs, b - a, 0.06), a)

    # 4/4 kick/hat/snare
    t = 0.0
    beat = 0
    while t < DURATION:
        place(buf, kick(), t)
        place(buf, hat(vol=0.06), t + BEAT * 0.5)
        if beat % 2 == 1:
            place(buf, snare(), t)
        # light offbeat hat
        place(buf, hat(vol=0.04), t + BEAT * 0.25)
        t += BEAT
        beat += 1

    # Accent whooshes / risers at cuts
    for c in CUTS[:-1]:
        # short rising tone into cut
        rise_len = 0.35
        n_r = int(SR * rise_len)
        tt = np.arange(n_r) / SR
        freq = 200 + 600 * (tt / rise_len)
        phase = np.cumsum(2 * math.pi * freq / SR)
        whoosh = np.sin(phase) * env(n_r, 0.05, 0.15) * 0.12
        noise = rng.uniform(-1, 1, n_r) * env(n_r, 0.02, 0.2) * 0.08
        place(buf, whoosh + noise, max(0, c - rise_len))
        # hit
        place(buf, kick(0.22, 0.5), c)
        place(buf, tone(660, 0.12, 0.1, "tri"), c)

    # Soft lowpass-ish damp extremes + normalize
    peak = np.max(np.abs(buf)) or 1.0
    buf = buf / peak * 0.85
    # gentle fade out last 1.2s
    fade = int(1.2 * SR)
    buf[-fade:] *= np.linspace(1, 0, fade)

    out = Path(__file__).with_name("bed.wav")
    with wave.open(str(out), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        pcm = np.clip(buf, -1, 1)
        w.writeframes((pcm * 32767).astype(np.int16).tobytes())
    print(f"wrote {out} ({DURATION}s, {BPM} BPM)")


if __name__ == "__main__":
    main()
