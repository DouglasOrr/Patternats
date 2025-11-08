import * as G from "./core/game";
import * as V from "./core/view";

window.onload = () => {
  const game = new G.Game(
    [
      new G.Pattern(G.Grid.parse("-x-/xxx/-x-"), 25),
      new G.Pattern(G.Grid.parse("xx/xx"), 4),
    ],
    [new G.SwapAction(), new G.SwapAction()],
    9,
    9,
    /*targetScore=*/ 100
  );
  V.start(game);
};
