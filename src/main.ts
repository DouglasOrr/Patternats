import * as G from "./core/game";
import * as V from "./core/view";

window.onload = () => {
  const game = new G.Game(
    9,
    9,
    [
      new G.Pattern(G.Grid.parse("-x-/xxx/-x-"), 25),
      new G.Pattern(G.Grid.parse("xx/xx"), 4),
    ],
    /*targetScore=*/ 100
  );
  V.start(game);
};
