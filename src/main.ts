import * as G from "./core/grid";

class Game {
  grid: G.Grid;

  constructor(rows: number, cols: number) {
    this.grid = G.Grid.random(rows, cols);
  }

  newGrid() {
    this.grid = G.Grid.random(this.grid.rows, this.grid.cols);
  }

  swap(r0: number, c0: number, r1: number, c1: number) {
    this.grid = this.grid.swap(r0, c0, r1, c1);
  }
}

class Renderer {
  private cellSize: number = 1;
  private swapSource: [number, number] | null = null;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly game: Game
  ) {
    this.update();
    ctx.canvas.addEventListener("click", (event) => {
      const rect = ctx.canvas.getBoundingClientRect();
      const row = Math.floor((event.clientY - rect.top) / this.cellSize);
      const col = Math.floor((event.clientX - rect.left) / this.cellSize);
      if (this.swapSource === null) {
        this.swapSource = [row, col];
      } else {
        const [fromRow, fromCol] = this.swapSource;
        this.game.swap(fromRow, fromCol, row, col);
        this.swapSource = null;
      }
      this.update();
    });
  }

  update() {
    this.cellSize = Math.min(
      this.ctx.canvas.width / this.game.grid.cols,
      this.ctx.canvas.height / this.game.grid.rows
    );
    this.draw();
  }

  draw() {
    const pad = this.cellSize / 10;
    this.ctx.fillStyle = "black";
    const grid = this.game.grid;
    this.ctx.fillRect(
      0,
      0,
      grid.cols * this.cellSize,
      grid.rows * this.cellSize
    );
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        this.ctx.fillStyle = grid.cells[r * grid.cols + c] ? "red" : "blue";
        this.ctx.fillRect(
          c * this.cellSize + pad,
          r * this.cellSize + pad,
          this.cellSize - pad * 2,
          this.cellSize - pad * 2
        );
        if (
          this.swapSource !== null &&
          this.swapSource[0] === r &&
          this.swapSource[1] === c
        ) {
          this.ctx.strokeStyle = "yellow";
          this.ctx.lineWidth = 3;
          this.ctx.strokeRect(
            c * this.cellSize + pad,
            r * this.cellSize + pad,
            this.cellSize - pad * 2,
            this.cellSize - pad * 2
          );
        }
      }
    }
  }
}

window.onload = () => {
  const canvas = document.getElementById("canvas-main") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const game = new Game(7, 7);
  const renderer = new Renderer(ctx, game);

  document.getElementById("btn-new")!.addEventListener("click", () => {
    game.newGrid();
    renderer.update();
  });
};
