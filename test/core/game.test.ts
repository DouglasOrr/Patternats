import { Grid, Cell, Pattern } from "../../src/core/game";

test("Grid init", () => {
  const grid = Grid.random(3, 4);
  expect(grid.rows).toBe(3);
  expect(grid.cols).toBe(4);
  expect(grid.cells).toHaveLength(12);
});

test("Grid parse, get, swap", () => {
  const grid = Grid.parse("x-/--");
  expect(grid.get(0, 0)).toBe(Cell.X);
  expect(grid.get(1, 0)).toBe(Cell.O);

  const swapped = grid.swap(0, 2);
  expect(grid.get(0, 0)).toBe(Cell.X);
  expect(grid.get(1, 0)).toBe(Cell.O);
  expect(swapped.get(0, 0)).toBe(Cell.O);
  expect(swapped.get(1, 0)).toBe(Cell.X);
});

test("Grid getComponents", () => {
  const grid = Grid.parse("xxx-/-x-x/x-x-");
  const c = grid.getComponents();
  expect(c.components).toEqual([[0, 1, 2, 5], [7], [8], [10]]);
  /* prettier-ignore */
  expect(c.cellToComponent).toEqual([
    0, 0, 0, null, null, 0, null, 1, 2, null, 3, null
  ]);
});

test("Pattern find", () => {
  const grid = Grid.parse("xxx-/-x-x/x-x-");
  const matches = new Pattern(Grid.parse("x-/-x"), 0).find(grid);
  expect(matches).toEqual([2, 5]);
});
