import { fromFileUrl } from "@std/path";

type Matrix = string[][];
type Direction = { x: number; y: number };
type Orientation =
  | "UP_LEFT"
  | "UP"
  | "UP_RIGHT"
  | "RIGHT"
  | "DOWN_RIGHT"
  | "DOWN"
  | "DOWN_LEFT"
  | "LEFT";

const DIRECTIONS: { [key in Orientation]: Direction } = {
  UP_LEFT: { y: -1, x: -1 },
  UP: { y: -1, x: 0 },
  UP_RIGHT: { y: -1, x: 1 },
  RIGHT: { y: 0, x: 1 },
  DOWN_RIGHT: { y: 1, x: 1 },
  DOWN: { y: 1, x: 0 },
  DOWN_LEFT: { y: 1, x: -1 },
  LEFT: { y: 0, x: -1 },
};

type Line = { m: Orientation; s: Orientation };
type Xshape = [Line, Line];

const X_SHAPES: Xshape[] = [
  [
    { m: "UP_LEFT", s: "DOWN_RIGHT" },
    { m: "DOWN_LEFT", s: "UP_RIGHT" },
  ],
  [
    { m: "UP_LEFT", s: "DOWN_RIGHT" },
    { m: "UP_RIGHT", s: "DOWN_LEFT" },
  ],
  [
    { m: "UP_RIGHT", s: "DOWN_LEFT" },
    { m: "DOWN_RIGHT", s: "UP_LEFT" },
  ],
  [
    { m: "DOWN_RIGHT", s: "UP_LEFT" },
    { m: "DOWN_LEFT", s: "UP_RIGHT" },
  ],
];

const XMAS = "XMAS".split("");

async function readInput(path: string): Promise<string> {
  const absolutePath = fromFileUrl(import.meta.resolve(path));
  const readInput = await Deno.readTextFile(absolutePath);
  console.log(readInput);
  return readInput;
}

function generateMatrix(input: string) {
  const matrix: Matrix = input.split("\n").map((line) => line.trim().split(""));
  console.log(matrix);
  return matrix;
}

function isXmas(
  matrix: Matrix,
  direction: Direction,
  x0: number,
  y0: number
): boolean {
  let x = x0;
  let y = y0;
  for (const letter of XMAS) {
    if (Array.isArray(matrix[y]) && matrix[y][x] === letter) {
      y += direction.y;
      x += direction.x;
    } else {
      return false;
    }
  }
  return true;
}

const isMasOnXShape = (matrix: Matrix, x0: number, y0: number): boolean => {
  for (const shape of X_SHAPES) {
    const isX = shape
      .map((line) => {
        const mx = DIRECTIONS[line.m].x;
        const my = DIRECTIONS[line.m].y;
        const sx = DIRECTIONS[line.s].x;
        const sy = DIRECTIONS[line.s].y;

        const isM =
          Array.isArray(matrix[y0 + my]) && matrix[y0 + my][x0 + mx] === "M";
        const isS =
          Array.isArray(matrix[y0 + sy]) && matrix[y0 + sy][x0 + sx] === "S";
        return isM && isS;
      })
      .reduce((acc, curr) => acc && curr, true);
    if (isX) return true;
  }
  return false;
};

const countXmas = (matrix: Matrix): number => {
  let counter = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === "X") {
        counter += Object.values(DIRECTIONS)
          .map((direction) => isXmas(matrix, direction, x, y))
          .reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
      }
    }
  }
  return counter;
};

const countMasOnXShape = (matrix: Matrix): number => {
  let counter = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === "A" && isMasOnXShape(matrix, x, y)) {
        counter++;
      }
    }
  }

  return counter;
};

const exampleInput = await readInput("./input-example.txt");
const input = await readInput("./input.txt");
const exampleMatrix = generateMatrix(exampleInput);
const matrix = generateMatrix(input);

console.log(countXmas(exampleMatrix));
console.log(countMasOnXShape(exampleMatrix));
console.log(countXmas(matrix));
console.log(countMasOnXShape(matrix));
