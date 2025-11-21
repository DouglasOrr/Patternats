import { Frequency, Grid, Item, Score } from "./wave";

export const Items = {} as { [name: string]: Item };

// Helpers

function register(item: Item): void {
  if (Items[item.name]) {
    throw new Error(`Item with name "${item.name}" is already registered.`);
  }
  Items[item.name] = item;
}

let nextPriority = 0;

function action(
  name: string,
  titleDescription: [string, string],
  freq: Frequency,
  execute: (grid: Grid, arg: any) => Grid,
  args: { limit?: number } = {}
): void {
  register({
    kind: "action",
    name,
    title: titleDescription[0],
    description: titleDescription[1],
    freq,
    limit: args.limit,
    priority: nextPriority++,
    execute,
  });
}

function bonus(
  name: string,
  titleDescription: [string, string],
  freq: Frequency,
  args: { onScore: (score: Score) => void; limit?: number }
): void {
  register({
    kind: "bonus",
    name,
    title: titleDescription[0],
    description: titleDescription[1],
    freq,
    limit: args.limit ?? Infinity,
    priority: nextPriority++,
    onScore: args.onScore,
  });
}

function pattern(
  title: string,
  gridStr: string,
  points: number,
  freq: Frequency,
  args: { limit?: number } = {}
): void {
  const name = title.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  register({
    kind: "pattern",
    name,
    title,
    grid: Grid.parse(gridStr),
    points,
    freq,
    limit: args.limit ?? Infinity,
    priority: nextPriority++,
  });
}

// Actions

action(
  "swap",
  ["Swap", "select 2 cells to swap"],
  "uncommon",
  (grid: Grid, arg: { i: number; j: number }) => {
    const cellsOut = grid.cells.slice();
    [cellsOut[arg.i], cellsOut[arg.j]] = [cellsOut[arg.j], cellsOut[arg.i]];
    return grid.replace(cellsOut);
  },
  { limit: Infinity }
);

// Patterns

pattern("Square S", "xx/xx", 5, "common");
pattern("Square M", "xxx/xxx/xxx", 20, "uncommon");
pattern("Square L", "xxxx/xxxx/xxxx/xxxx", 125, "rare");
pattern("Square XL", "xxxxx/xxxxx/xxxxx/xxxxx/xxxxx", 300, "rare");

pattern("Line", "xxxx", 5, "uncommon");
pattern("Line L", "xxxxxx", 15, "uncommon");
pattern("Column", "x/x/x/x", 5, "uncommon");
pattern("Column L", "x/x/x/x/x/x", 15, "uncommon");

pattern("Plus", "-x-/xxx/-x-", 25, "common");
pattern("Heli Pad", "x-x/xxx/x-x", 25, "common");
pattern("Four", "x-x/xxx/--x", 25, "common");
pattern("T", "xxx/-x-/-x-", 25, "common");
pattern("Box", "xxx/x-x/xxx", 25, "common");
pattern("B2", "xxx/-xx/--x", 30, "uncommon");
pattern("R pentomino", "-xx/xx-/-x-", 30, "rare");

pattern("Big I", "xxx/-x-/-x-/xxx", 45, "uncommon");
pattern("Big G", "xxx/x--/x-x/xxx", 45, "uncommon");
pattern("Big S", "xx/x-/xx/-x/xx", 45, "uncommon");
pattern("Big E", "xx/x-/xx/x-/xx", 45, "rare");

pattern("Pyramid", "--x--/-xxx-/xxxxx", 50, "uncommon");
pattern("Pinwheel", "--x-/xxx-/-xxx/-x--", 125, "rare");
pattern("Big Box", "xxxx/x--x/x--x/xxxx", 125, "rare");
pattern("Noughts & Crosses", "-x-x-/xxxxx/-x-x-/xxxxx/-x-x-", 400, "rare");

pattern("Rhode Island Z", "-xx/xx-", 12, "common");
pattern("Cleveland Z", "xx-/-xx", 12, "common");
pattern("C", "xx/x-/xx", 12, "uncommon");
pattern("L", "x-/x-/xx", 12, "common");

// Bonuses

bonus("flat_points", ["-20", "subtract 20 nnats"], "common", {
  onScore(score: Score): void {
    score.flatPoints += 20;
  },
  limit: Infinity,
});
