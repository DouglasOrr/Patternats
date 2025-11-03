import { Grid } from "../../src/core/grid";

test("Grid init", () => {
  const grid = Grid.random(3, 4);
  expect(grid.rows).toBe(3);
  expect(grid.cols).toBe(4);
  expect(grid.cells).toHaveLength(12);
});

test("Grid get, swap", () => {
  const grid = new Grid(2, 2, [true, false, false, true]);
  expect(grid.get(0, 0)).toBe(true);
  expect(grid.get(0, 1)).toBe(false);

  const swapped = grid.swap(0, 0, 0, 1);
  expect(grid.get(0, 0)).toBe(true);
  expect(grid.get(0, 1)).toBe(false);
  expect(swapped.get(0, 0)).toBe(false);
  expect(swapped.get(0, 1)).toBe(true);
});
