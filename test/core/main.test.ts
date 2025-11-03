import { Grid } from "../../src/core/grid";

test("Grid init", () => {
  const grid = new Grid(3, 4);
  expect(grid.rows).toBe(3);
  expect(grid.cols).toBe(4);
  expect(grid.cells).toHaveLength(12);
});
