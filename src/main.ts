import * as A from "./core/achievements";
import * as R from "./core/run";
import { Items } from "./core/items";
import "./core/sound";
import * as V from "./core/view";
import "./static/style.css";

window.onload = () => {
  // A.AchievementTracker.reset();
  A.setItemsAndLevels(Items, R.Levels);
  V.start({
    skipTo: null,
    // skipTo: "introduction",
    // skipTo: { level: "level_1" },
    // skipTo: "achievements",
    // skipTo: "settings",
  });
};
