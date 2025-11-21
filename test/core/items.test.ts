import * as G from "../../src/core/wave";
import { Items } from "../../src/core/items";

test("Action swap", () => {
  const grid = G.Grid.parse("x-/--");
  const swapped = (Items["swap"] as G.Action).execute(grid, { i: 0, j: 2 });
  expect(grid.get(0, 0)).toBe(G.Cell.X);
  expect(grid.get(1, 0)).toBe(G.Cell.O);
  expect(swapped.get(0, 0)).toBe(G.Cell.O);
  expect(swapped.get(1, 0)).toBe(G.Cell.X);
});

describe("patterns", () => {
  for (const [itemName, item] of Object.entries(Items)) {
    if (item.kind === "pattern") {
      describe(`pattern ${itemName}`, () => {
        test("one connected component", () => {
          const c = item.grid.getComponents();
          expect(c.components.length).toBe(1);
        });

        test("is not a duplicate", () => {
          for (const other of Object.values(Items)) {
            if (
              other.kind === "pattern" &&
              other.name !== item.name &&
              other.grid.dump() === item.grid.dump()
            ) {
              throw new Error(
                `Pattern ${item.name} is a duplicate of ${other.name}`
              );
            }
          }
        });
      });
    }
  }
});
