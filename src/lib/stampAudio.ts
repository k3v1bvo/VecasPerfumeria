// Synthesized tactile ink stamp sound using native Web Audio API (Zero external audio asset lag)
export function playStampSound() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // 1. Mechanical ink stamp "thump"
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.17);

    // 2. Paper card texture snap
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = "triangle";
    snap.frequency.setValueAtTime(360, ctx.currentTime);
    snap.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.07);

    snapGain.gain.setValueAtTime(0.2, ctx.currentTime);
    snapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    snap.connect(snapGain);
    snapGain.connect(ctx.destination);

    snap.start(ctx.currentTime);
    snap.stop(ctx.currentTime + 0.09);
  } catch {
    // Audio context not allowed or unsupported in current environment
  }
}
