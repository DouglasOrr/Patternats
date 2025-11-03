import * as g from "./core/grid";

window.onload = () => {
  const grid = new g.Grid(7, 7);
  console.log(grid.dump());

  const canvas = document.getElementById("canvas-main") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "black";
  const cellSize = Math.min(
    canvas.width / grid.cols,
    canvas.height / grid.rows
  );
  const pad = cellSize / 10;
  ctx.fillRect(0, 0, grid.cols * cellSize, grid.rows * cellSize);
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      ctx.fillStyle = grid.cells[y * grid.cols + x] ? "red" : "blue";
      ctx.fillRect(
        x * cellSize + pad,
        y * cellSize + pad,
        cellSize - pad * 2,
        cellSize - pad * 2
      );
    }
  }
};
