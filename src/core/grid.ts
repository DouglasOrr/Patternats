export class Grid {
  // Creation

  constructor(
    readonly rows: number,
    readonly cols: number,
    readonly cells: boolean[]
  ) {}

  static random(rows: number, cols: number): Grid {
    return new Grid(
      rows,
      cols,
      Array.from({ length: rows * cols }, () => Math.random() < 0.5)
    );
  }

  static parse(s: string): Grid {
    const lines = s.trim().split("/");
    const rows = lines.length;
    const cols = lines[0].length;
    const cells: boolean[] = [];
    for (const line of lines) {
      if (line.length !== cols) {
        throw new Error("Grid.parse: Inconsistent row lengths");
      }
      for (const ch of line) {
        if (ch === "x") {
          cells.push(true);
        } else if (ch === "-") {
          cells.push(false);
        } else {
          throw new Error(`Grid.parse: Invalid character: ${ch}`);
        }
      }
    }
    return new Grid(rows, cols, cells);
  }

  // Utility

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

  // Core

  swap(i: number, j: number): Grid {
    const cellsOut = this.cells.slice();
    [cellsOut[i], cellsOut[j]] = [cellsOut[j], cellsOut[i]];
    return new Grid(this.rows, this.cols, cellsOut);
  }

  match(pattern: Grid): number[] {
    const matches: number[] = [];
    for (let i = 0; i < this.rows * this.cols; i++) {
      if (
        Math.floor(i / this.cols) + pattern.rows <= this.rows &&
        (i % this.cols) + pattern.cols <= this.cols
      ) {
        let isMatch = true;
        for (let j = 0; j < pattern.rows * pattern.cols && isMatch; j++) {
          const pr = Math.floor(j / pattern.cols);
          const pc = j % pattern.cols;
          isMatch &&= pattern.cells[j] === this.cells[i + pr * this.cols + pc];
        }
        if (isMatch) {
          matches.push(i);
        }
      }
    }
    return matches;
  }
}
