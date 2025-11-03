export class Grid {
  cells: boolean[];

  constructor(readonly rows: number, readonly cols: number) {
    this.cells = Array.from({ length: rows * cols }, () => Math.random() < 0.5);
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
