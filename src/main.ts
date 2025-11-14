import * as G from "./core/game";
import * as V from "./core/view";

window.onload = () => {
  const game = new G.Game(
    [G.PlusPattern, G.SquarePattern],
    [G.SwapAction, G.SwapAction],
    [G.FlatPointsBonus],
    9,
    9,
    /*targetScore=*/ 100
  );
  V.start(game);
};
