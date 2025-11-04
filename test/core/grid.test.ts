import { Grid } from "../../src/core/grid";

test("Grid init", () => {
  const grid = Grid.random(3, 4);
  expect(grid.rows).toBe(3);
  expect(grid.cols).toBe(4);
  expect(grid.cells).toHaveLength(12);
});

test("Grid parse, get, swap", () => {
  const grid = Grid.parse("x-/--");
  expect(grid.get(0, 0)).toBe(true);
  expect(grid.get(1, 0)).toBe(false);

  const swapped = grid.swap(0, 2);
  expect(grid.get(0, 0)).toBe(true);
  expect(grid.get(1, 0)).toBe(false);
  expect(swapped.get(0, 0)).toBe(false);
  expect(swapped.get(1, 0)).toBe(true);
});

test("Grid match", () => {
  const grid = Grid.parse("xxx-/-x-x/x-x-");
  const matches = grid.match(Grid.parse("x-/-x"));
  expect(matches).toEqual([2, 5]);
});
