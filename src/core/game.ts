import * as R from "./run";

export interface GameSettings {
  skipTo: "run" | "wave" | null;
  run: R.RunSettings;
}
