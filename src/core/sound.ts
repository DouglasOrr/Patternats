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

const ENABLED_KEY = "music_enabled";

class PlayerImpl {
  private audio: HTMLAudioElement;
  private index = 0;
  private tracks: string[];

  constructor() {
    this.audio = new Audio();
    this.audio.onended = () => this.next();
    this.audio.volume = 0.5;
    this.tracks = TRACKS.slice();
    this.shuffle();
    // wait for interaction
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
    const s = localStorage.getItem(ENABLED_KEY);
    return s === null ? true : s === "true";
  }

  set enabled(value: boolean) {
    localStorage.setItem(ENABLED_KEY, value.toString());
    this.loadAndPlay();
  }

  private next() {
    this.index = (this.index + 1) % this.tracks.length;
    this.loadAndPlay();
  }

  private loadAndPlay() {
    if (this.enabled) {
      this.audio.src = `music/${this.tracks[this.index]}`;
      this.audio.play().catch((e) => console.warn("Audio playback failed", e));
    } else {
      this.audio.pause();
    }
  }
}

export const Player = new PlayerImpl();
