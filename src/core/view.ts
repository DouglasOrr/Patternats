import * as G from "./game";

export function start(game: G.Game): void {
  new Renderer(game);
}

class Renderer {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly cellSize: number;
  private swapSource: number | null = null;

  constructor(private readonly game: G.Game) {
    const canvas = document.getElementById("canvas-main") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d")!;
    this.cellSize = Math.min(
      this.ctx.canvas.width / this.game.grid.cols,
      this.ctx.canvas.height / this.game.grid.rows
    );
    this.draw();
    game.onUpdate.push(() => this.draw());

    this.ctx.canvas.addEventListener("click", (event) => {
      const rect = this.ctx.canvas.getBoundingClientRect();
      const idx = this.game.grid.index(
        Math.floor((event.clientY - rect.top) / this.cellSize),
        Math.floor((event.clientX - rect.left) / this.cellSize)
      );
      if (this.swapSource === null) {
        this.swapSource = idx;
      } else if (this.swapSource === idx) {
        this.swapSource = null;
      } else {
        this.game.swap(this.swapSource, idx);
        this.swapSource = null;
      }
      this.draw();
    });

    document.getElementById("btn-new")!.addEventListener("click", () => {
      game.newGrid();
    });
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

    const overlay = new Array(grid.cells.length).fill(false);
    for (const [n, pattern] of this.game.patterns.entries()) {
      for (const i of this.game.matches[n]) {
        for (let j = 0; j < pattern.rows * pattern.cols; j++) {
          overlay[
            i + Math.floor(j / pattern.cols) * grid.cols + (j % pattern.cols)
          ] = true;
        }
      }
    }

    for (let i = 0; i < grid.cells.length; i++) {
      const r = Math.floor(i / grid.cols);
      const c = i % grid.cols;
      if (grid.cells[i] !== null) {
        this.ctx.fillStyle = !grid.cells[i]
          ? "blue"
          : overlay[i]
          ? "yellow"
          : "red";
        this.ctx.fillRect(
          c * this.cellSize + pad,
          r * this.cellSize + pad,
          this.cellSize - pad * 2,
          this.cellSize - pad * 2
        );
        if (this.swapSource === i) {
          this.ctx.strokeStyle = "#ff00ff";
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
