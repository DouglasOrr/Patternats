import * as G from "./core/game";
import * as V from "./core/view";

window.onload = () => {
  const game = new G.Game(7, 7, [
    G.Grid.parse("-x-/xxx/-x-"),
    G.Grid.parse("xx/xx"),
  ]);
  V.start(game);
};
