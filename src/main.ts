import * as G from "./core/grid";

class Renderer {
  private cellSize: number = 1;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private grid: G.Grid
  ) {
    this.update(grid);
  }

  update(grid: G.Grid) {
    this.grid = grid;
    this.cellSize = Math.min(
      this.ctx.canvas.width / grid.cols,
      this.ctx.canvas.height / grid.rows
    );
    this.draw();
  }

  draw() {
    const pad = this.cellSize / 10;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      0,
      0,
      this.grid.cols * this.cellSize,
      this.grid.rows * this.cellSize
    );
    for (let y = 0; y < this.grid.rows; y++) {
      for (let x = 0; x < this.grid.cols; x++) {
        this.ctx.fillStyle = this.grid.cells[y * this.grid.cols + x]
          ? "red"
          : "blue";
        this.ctx.fillRect(
          x * this.cellSize + pad,
          y * this.cellSize + pad,
          this.cellSize - pad * 2,
          this.cellSize - pad * 2
        );
      }
    }
  }
}

window.onload = () => {
  const canvas = document.getElementById("canvas-main") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const renderer = new Renderer(ctx, G.Grid.random(7, 7));

  document.getElementById("btn-new")!.onclick = () => {
    renderer.update(G.Grid.random(7, 7));
  };
};
