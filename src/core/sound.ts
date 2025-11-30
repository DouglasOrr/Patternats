const TRACKS = [
  "music_smt_Julia_018.mp3",
  "audio_hero_Boutique_SIPML_C-0105.mp3",
  "music_dave_miles_jazzing_around.mp3",
  "music_zapsplat_on_the_job_140.mp3",
  "music_zapsplat_win_city.mp3",
  "music_zapsplat_as_time_passes_124.mp3",
  "audio_hero_Single-Malt_SIPML_C-1105.mp3",
  "audio_hero_Urban-Delivery_SIPML_C-0810.mp3",
];

const MUSIC_ENABLED_KEY = "music_enabled";
const EFFECTS_ENABLED_KEY = "effects_enabled";

class MusicPlayerImpl {
  private tracks: string[];
  private trackIndex = 0;
  private audio: HTMLAudioElement;

  constructor() {
    this.tracks = TRACKS.slice();
    this.shuffle();
    this.audio = new Audio();
    this.audio.onended = () => this.next();
    this.audio.volume = 0.5;
    // wait for interaction before autoplaying
    const player = this;
    function onClick() {
      player.loadAndPlay();
      document.removeEventListener("click", onClick);
    }
    document.addEventListener("click", onClick);
  }

  shuffle(): void {
    for (let i = this.tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
    }
  }

  get enabled(): boolean {
    const s = localStorage.getItem(MUSIC_ENABLED_KEY);
    return s === null ? true : s === "true";
  }

  set enabled(value: boolean) {
    localStorage.setItem(MUSIC_ENABLED_KEY, value.toString());
    this.loadAndPlay();
  }

  private next() {
    this.trackIndex = (this.trackIndex + 1) % this.tracks.length;
    this.loadAndPlay();
  }

  private loadAndPlay() {
    if (this.enabled) {
      this.audio.src = `music/${this.tracks[this.trackIndex]}`;
      this.audio.play().catch((e) => console.warn("Audio playback failed", e));
    } else {
      this.audio.pause();
    }
  }
}

class EffectsPlayerImpl {
  private effectAudio: Record<string, HTMLAudioElement> = {};

  get enabled(): boolean {
    const s = localStorage.getItem(EFFECTS_ENABLED_KEY);
    return s === null ? true : s === "true";
  }

  set enabled(value: boolean) {
    localStorage.setItem(EFFECTS_ENABLED_KEY, value.toString());
  }

  play(name: string): void {
    if (this.enabled) {
      let template = this.effectAudio[name];
      if (!template) {
        template = new Audio(`sound/${name}.mp3`);
        template.preload = "auto";
        template.volume = 0.5;
        this.effectAudio[name] = template;
      }
      const instance = template.cloneNode(true) as HTMLAudioElement;
      instance.volume = template.volume;
      instance
        .play()
        .catch((err) => console.warn("Audio playback failed", err));
    }
  }
}

export const Music = new MusicPlayerImpl();
export const Effects = new EffectsPlayerImpl();
