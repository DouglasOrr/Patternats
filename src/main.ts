import * as G from "./core/game";
import { Items } from "./core/items";
import * as R from "./core/run";
import "./core/sound";
import * as V from "./core/view";
import "./static/style.css";

window.onload = () => {
  // G.AchievementTracker.reset();
  G.registerItems(Items);

  const settings: G.GameSettings = {
    // skipTo: null,
    // skipTo: "new_run",
    // skipTo: "achievements",
    skipTo: "settings",
    run: R.standardSettings({
      waves: 20,
      start: { common: 4, uncommon: 2, rare: 1 },
      end: { common: 1, uncommon: 2, rare: 2 },
      items: [
        // Actions
        "swap",
        "swap",
        // Patterns
        // Bonuses
      ],
      // skipToFirstWave: true,
    }),
  };
  V.start(settings);
};
