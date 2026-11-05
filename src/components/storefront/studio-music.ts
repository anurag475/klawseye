// Original mood loops synthesised live with the Web Audio API, so there are no audio files or licences.
// Each track is a function called once per 16th note; it schedules whatever should sound on that step.

export type TrackId = "acoustic" | "pop" | "lofi" | "bollywood";

type StepContext = { ctx: BaseAudioContext; out: AudioNode; time: number; step: number };
type Track = {
  bpm: number;
  swing?: number;
  gain: number;
  lowpass?: number;
  play: (s: StepContext) => void;
};

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function tone(
  { ctx, out, time }: StepContext,
  opts: {
    midi: number;
    type?: OscillatorType;
    length: number;
    gain: number;
    attack?: number;
    cutoff?: number;
    detune?: number;
    slideFrom?: number;
  },
) {
  const { midi, type = "sine", length, gain, attack = 0.005, cutoff, detune = 0, slideFrom } = opts;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.detune.value = detune;
  osc.frequency.setValueAtTime(hz(slideFrom ?? midi), time);
  if (slideFrom !== undefined) osc.frequency.exponentialRampToValueAtTime(hz(midi), time + 0.09);
  env.gain.setValueAtTime(0.0001, time);
  env.gain.exponentialRampToValueAtTime(gain, time + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, time + attack + length);
  osc.connect(env);
  if (cutoff) {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, time);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(200, cutoff * 0.35),
      time + attack + length,
    );
    env.connect(filter).connect(out);
  } else {
    env.connect(out);
  }
  osc.start(time);
  osc.stop(time + attack + length + 0.02);
}

const noiseBuffers = new WeakMap<BaseAudioContext, AudioBuffer>();
function noise(
  { ctx, out, time }: StepContext,
  opts: { filter: BiquadFilterType; freq: number; length: number; gain: number },
) {
  let buffer = noiseBuffers.get(ctx);
  if (!buffer) {
    buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // A fixed pseudo-random sequence keeps every playback of a loop identical.
    let seed = 12345;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      data[i] = seed / 1073741824 - 1;
    }
    noiseBuffers.set(ctx, buffer);
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const env = ctx.createGain();
  source.buffer = buffer;
  filter.type = opts.filter;
  filter.frequency.value = opts.freq;
  env.gain.setValueAtTime(opts.gain, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + opts.length);
  source.connect(filter).connect(env).connect(out);
  source.start(time, (time * 7.3) % 0.8, opts.length + 0.02);
}

function kick({ ctx, out, time }: StepContext, gain: number) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.frequency.setValueAtTime(130, time);
  osc.frequency.exponentialRampToValueAtTime(44, time + 0.11);
  env.gain.setValueAtTime(gain, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);
  osc.connect(env).connect(out);
  osc.start(time);
  osc.stop(time + 0.32);
}

const pattern = (steps: number[], step: number, size = 16) => steps.includes(step % size);

// Warm guitar-like arpeggios over a slow major progression.
const acoustic: Track = {
  bpm: 76,
  gain: 0.95,
  lowpass: 4200,
  play(s) {
    const bar = Math.floor(s.step / 16) % 4;
    const chord = [
      [48, 55, 64, 67, 71],
      [45, 52, 60, 64, 67],
      [41, 53, 60, 65, 69],
      [43, 55, 62, 67, 71],
    ][bar]!;
    const pick = (midi: number, gain: number, length = 1.5) => {
      tone(s, { midi, type: "triangle", length, gain, cutoff: 2600 });
      tone(s, { midi: midi + 12, type: "sine", length: 0.3, gain: gain * 0.2 });
    };
    if (s.step % 16 === 0) pick(chord[0]!, 0.3, 2.2);
    if (s.step % 2 === 0) {
      const order = [1, 2, 3, 4, 3, 2, 3, 2];
      pick(chord[order[(s.step / 2) % 8]!]!, 0.17);
    }
    const melody: Record<number, number> = {
      48: 76,
      54: 79,
      60: 76,
      64: 72,
      76: 74,
      82: 72,
      88: 69,
      112: 74,
      120: 79,
    };
    const note = melody[s.step % 128];
    if (note) pick(note, 0.14, 1.8);
    if (s.step % 4 === 2) noise(s, { filter: "highpass", freq: 6500, length: 0.05, gain: 0.018 });
  },
};

// Four-on-the-floor dance pop with a bright hook.
const pop: Track = {
  bpm: 122,
  gain: 0.8,
  play(s) {
    const bar = Math.floor(s.step / 16) % 4;
    const root = [45, 41, 48, 43][bar]!;
    const triad = [
      [69, 72, 76],
      [69, 72, 77],
      [67, 72, 76],
      [67, 71, 74],
    ][bar]!;
    if (s.step % 4 === 0) kick(s, 0.75);
    if (pattern([4, 12], s.step)) {
      noise(s, { filter: "bandpass", freq: 1800, length: 0.16, gain: 0.32 });
      noise(s, { filter: "highpass", freq: 3500, length: 0.1, gain: 0.1 });
    }
    if (s.step % 4 === 2) noise(s, { filter: "highpass", freq: 8000, length: 0.07, gain: 0.09 });
    if (s.step % 2 === 0)
      tone(s, { midi: root - 12, type: "sawtooth", length: 0.17, gain: 0.2, cutoff: 700 });
    if (pattern([0, 3, 6, 10, 13], s.step)) {
      for (const midi of triad) {
        tone(s, { midi, type: "sawtooth", length: 0.2, gain: 0.05, cutoff: 3200, detune: -7 });
        tone(s, { midi, type: "sawtooth", length: 0.2, gain: 0.05, cutoff: 3200, detune: 7 });
      }
    }
    const hook: Record<number, number> = {
      0: 81,
      2: 81,
      4: 84,
      7: 81,
      10: 79,
      12: 76,
      16: 77,
      18: 77,
      20: 81,
      23: 79,
      26: 77,
      28: 76,
      32: 76,
      34: 79,
      36: 84,
      39: 83,
      42: 79,
      44: 76,
      48: 79,
      50: 79,
      52: 83,
      55: 86,
      58: 83,
    };
    const note = hook[s.step % 64];
    if (note) tone(s, { midi: note, type: "square", length: 0.22, gain: 0.055, cutoff: 3800 });
  },
};

// Dusty electric piano over a lazy, swung beat with record crackle.
const lofi: Track = {
  bpm: 72,
  swing: 0.3,
  gain: 1,
  lowpass: 2100,
  play(s) {
    const bar = Math.floor(s.step / 16) % 4;
    const chord = [
      [50, 65, 69, 72, 76],
      [43, 65, 69, 71, 76],
      [48, 64, 67, 71, 74],
      [45, 64, 67, 72, 74],
    ][bar]!;
    if (pattern([0, 10], s.step)) {
      tone(s, { midi: chord[0]!, length: 1.4, gain: 0.27 });
      chord.slice(1).forEach((midi, i) => {
        const at = { ...s, time: s.time + i * 0.012 };
        tone(at, { midi, length: 1.6, gain: 0.085, attack: 0.012 });
        tone(at, { midi: midi + 12, length: 0.45, gain: 0.018 });
      });
    }
    if (pattern([0, 7, 10], s.step)) kick(s, 0.58);
    if (pattern([4, 12], s.step))
      noise(s, { filter: "bandpass", freq: 1500, length: 0.17, gain: 0.26 });
    if (s.step % 2 === 0) noise(s, { filter: "highpass", freq: 5000, length: 0.05, gain: 0.07 });
    const melody: Record<number, number> = {
      6: 81,
      9: 79,
      14: 76,
      38: 79,
      41: 81,
      46: 84,
      70: 76,
      78: 74,
      102: 79,
      105: 76,
      110: 74,
    };
    const note = melody[s.step % 128];
    if (note) tone(s, { midi: note, type: "triangle", length: 0.9, gain: 0.1 });
    if (s.step % 3 === 1)
      noise(s, {
        filter: "highpass",
        freq: 3000,
        length: 0.012,
        gain: 0.035 + (s.step % 7) * 0.005,
      });
    if (s.step % 8 === 0) noise(s, { filter: "lowpass", freq: 900, length: 0.9, gain: 0.012 });
  },
};

// Retro film feel: tabla groove, harmonium drones and a sitar-style lead.
const bollywood: Track = {
  bpm: 100,
  gain: 0.9,
  play(s) {
    const bar = Math.floor(s.step / 16) % 4;
    const chord = [
      [62, 65, 69],
      [58, 62, 65],
      [60, 64, 67],
      [61, 64, 69],
    ][bar]!;
    if (s.step % 16 === 0) {
      for (const midi of chord) {
        tone(s, {
          midi,
          type: "sawtooth",
          length: 1.9,
          gain: 0.04,
          attack: 0.1,
          cutoff: 1500,
          detune: -6,
        });
        tone(s, {
          midi,
          type: "sawtooth",
          length: 1.9,
          gain: 0.04,
          attack: 0.1,
          cutoff: 1500,
          detune: 6,
        });
      }
      tone(s, { midi: chord[0]! - 24, type: "triangle", length: 0.7, gain: 0.26 });
    }
    if (s.step % 16 === 8)
      tone(s, { midi: chord[2]! - 24, type: "triangle", length: 0.5, gain: 0.2 });
    // Keherwa-style groove: low "dha" and ringing high "na" strokes.
    const bayan = [0, 3, 8, 22];
    const dayan = [2, 4, 6, 10, 12, 14, 18, 20, 24, 26, 28, 30];
    if (pattern(bayan, s.step, 32)) tone(s, { midi: 45, slideFrom: 50, length: 0.32, gain: 0.5 });
    if (pattern(dayan, s.step, 32)) {
      tone(s, { midi: 74, slideFrom: 76, length: 0.14, gain: 0.2 });
      noise(s, { filter: "bandpass", freq: 3000, length: 0.025, gain: 0.07 });
    }
    const lead: Record<number, number> = {
      0: 74,
      3: 77,
      6: 76,
      8: 74,
      12: 73,
      16: 70,
      19: 74,
      22: 77,
      24: 79,
      28: 77,
      32: 72,
      35: 76,
      38: 79,
      40: 76,
      44: 72,
      48: 73,
      51: 76,
      54: 81,
      56: 79,
      60: 76,
    };
    const note = lead[s.step % 64];
    if (note) {
      tone(s, {
        midi: note,
        slideFrom: note - 1,
        type: "sawtooth",
        length: 0.5,
        gain: 0.08,
        cutoff: 3000,
      });
      tone(s, { midi: note + 12, type: "triangle", length: 0.22, gain: 0.03 });
    }
  },
};

export const tracks: Record<TrackId, Track> = { acoustic, pop, lofi, bollywood };

/** Builds the per-track bus (level and tone) feeding `destination`. */
function createBus(ctx: BaseAudioContext, track: Track, destination: AudioNode) {
  const bus = ctx.createGain();
  bus.gain.value = track.gain;
  if (track.lowpass) {
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = track.lowpass;
    bus.connect(filter).connect(destination);
  } else {
    bus.connect(destination);
  }
  return bus;
}

const stepLength = (track: Track) => 60 / track.bpm / 4;
const swung = (track: Track, step: number) =>
  step % 2 === 1 ? stepLength(track) * (track.swing ?? 0) : 0;

/** Adds gentle limiting so no track or volume setting can clip the speakers. */
function createOutput(ctx: BaseAudioContext) {
  const master = ctx.createGain();
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -10;
  limiter.ratio.value = 8;
  limiter.attack.value = 0.004;
  limiter.release.value = 0.2;
  master.connect(limiter).connect(ctx.destination);
  return master;
}

/** Offline render of a loop, used to verify the music without playing it aloud. */
export function renderTrack(ctx: OfflineAudioContext, id: TrackId, seconds: number) {
  const track = tracks[id];
  const bus = createBus(ctx, track, createOutput(ctx));
  for (let step = 0, time = 0; time < seconds; step++, time += stepLength(track)) {
    track.play({ ctx, out: bus, step, time: time + swung(track, step) });
  }
  return ctx.startRendering();
}

export class StudioMusicPlayer {
  private ctx: AudioContext | undefined;
  private master: GainNode | undefined;
  private bus: GainNode | undefined;
  private timer: ReturnType<typeof setInterval> | undefined;
  private trackId: TrackId | undefined;
  private step = 0;
  private nextTime = 0;
  private volume = 0.7;

  static get supported() {
    return typeof window !== "undefined" && "AudioContext" in window;
  }

  /** Must be called from a click or key press: browsers block audio that starts on its own. */
  play(id: TrackId) {
    if (!StudioMusicPlayer.supported) return false;
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = createOutput(this.ctx);
      this.master.gain.value = this.volume;
    }
    void this.ctx.resume();
    if (this.trackId !== id) this.switchTo(id);
    this.timer ??= setInterval(() => this.schedule(), 50);
    this.schedule();
    return true;
  }

  pause() {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    void this.ctx?.suspend();
  }

  /** Crossfades to another track while playing. */
  change(id: TrackId) {
    if (this.timer && this.trackId !== id) this.switchTo(id);
  }

  setVolume(value: number) {
    this.volume = value;
    if (this.ctx && this.master)
      this.master.gain.setTargetAtTime(value, this.ctx.currentTime, 0.02);
  }

  destroy() {
    this.pause();
    void this.ctx?.close();
    this.ctx = undefined;
    this.trackId = undefined;
  }

  private switchTo(id: TrackId) {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    if (this.bus) {
      const old = this.bus;
      old.gain.cancelScheduledValues(now);
      old.gain.setTargetAtTime(0, now, 0.15);
      setTimeout(() => old.disconnect(), 1500);
    }
    const track = tracks[id];
    this.bus = createBus(ctx, track, master);
    this.bus.gain.setValueAtTime(0.0001, now);
    this.bus.gain.exponentialRampToValueAtTime(track.gain, now + 0.4);
    this.trackId = id;
    this.step = 0;
    this.nextTime = now + 0.06;
  }

  private schedule() {
    const { ctx, bus, trackId } = this;
    if (!ctx || !bus || !trackId) return;
    const track = tracks[trackId];
    // After a stall (such as a throttled tab), carry on from now instead of bunching up notes.
    if (this.nextTime < ctx.currentTime) this.nextTime = ctx.currentTime + 0.05;
    while (this.nextTime < ctx.currentTime + 0.25) {
      track.play({
        ctx,
        out: bus,
        step: this.step,
        time: this.nextTime + swung(track, this.step),
      });
      this.nextTime += stepLength(track);
      this.step++;
    }
  }
}
