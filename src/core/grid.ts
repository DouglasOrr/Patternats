export class Grid {
  constructor(
    readonly rows: number,
    readonly cols: number,
    readonly cells: boolean[]
  ) {}

  static random(rows: number, cols: number): Grid {
    const cells = Array.from(
      { length: rows * cols },
      () => Math.random() < 0.5
    );
    return new Grid(rows, cols, cells);
  }

  index(r: number, c: number): number {
    if (r < 0 || r >= this.rows) {
      throw new Error("Invalid row index");
    }
    if (c < 0 || c >= this.cols) {
      throw new Error("Invalid column index");
    }
    return r * this.cols + c;
  }

  get(r: number, c: number): boolean {
    return this.cells[this.index(r, c)];
  }

  swap(r0: number, c0: number, r1: number, c1: number): Grid {
    const idx0 = this.index(r0, c0);
    const idx1 = this.index(r1, c1);
    const cellsOut = this.cells.slice();
    [cellsOut[idx0], cellsOut[idx1]] = [cellsOut[idx1], cellsOut[idx0]];
    return new Grid(this.rows, this.cols, cellsOut);
  }

  dump(): string {
    let result = "+";
    for (let c = 0; c < this.cols; c++) {
      result += "-";
    }
    result += "+\n";
    for (let r = 0; r < this.rows; r++) {
      result += "|";
      for (let c = 0; c < this.cols; c++) {
        result += this.cells[r * this.cols + c] ? "x" : " ";
      }
      result += "|\n";
    }
    result += "+";
    for (let c = 0; c < this.cols; c++) {
      result += "-";
    }
    result += "+\n";
    return result;
  }
}
