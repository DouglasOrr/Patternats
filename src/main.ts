import * as R from "./core/run";
import * as V from "./core/view";

window.onload = () => {
  const run = new R.Run(
    R.standardSettings(
      /*waves*/ 3,
      { common: 4, uncommon: 2, rare: 1 },
      { common: 1, uncommon: 2, rare: 2 }
    )
  );
  V.start(run);
};
