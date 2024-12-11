import { fromFileUrl } from "@std/path";

type Matrix = number[][];
type Direction = { x: number; y: number };
type CardinalOrientation = "UP" | "RIGHT" | "DOWN" | "LEFT";

type DiagonalOrientation = "UP_LEFT" | "UP_RIGHT" | "DOWN_RIGHT" | "DOWN_LEFT";

type HeightsCoordinates = Set<string>;

const CARDINALS: { [key in CardinalOrientation]: Direction } = {
  UP: { y: -1, x: 0 },
  RIGHT: { y: 0, x: 1 },
  DOWN: { y: 1, x: 0 },
  LEFT: { y: 0, x: -1 },
};

const DIAGONALS: { [key in DiagonalOrientation]: Direction } = {
  UP_LEFT: { y: -1, x: -1 },
  UP_RIGHT: { y: -1, x: 1 },
  DOWN_RIGHT: { y: 1, x: 1 },
  DOWN_LEFT: { y: 1, x: -1 },
};

const getFormattedInput = async (filePath: string): Promise<Matrix> => {
  const absolutePath = fromFileUrl(import.meta.resolve(filePath));
  const input = await Deno.readTextFile(absolutePath);
  const matrix = input.split("\n").map((row) => row.trim().split(""));
  const parsedMatrix = matrix.map((row) =>
    row.map((height) => parseInt(height))
  );

  console.log(parsedMatrix);
  return parsedMatrix;
};

const verifyPosition = (matrix: Matrix, x: number, y: number): boolean => {
  if (
    y >= 0 &&
    y < matrix.length &&
    x >= 0 &&
    x < matrix[y].length &&
    10 > matrix[y][x] &&
    matrix[y][x] >= 0
  ) {
    return true;
  }
  return false;
};

const trailheadsDFS = (
  matrix: Matrix,
  x0: number,
  y0: number,
  visitedHeights: HeightsCoordinates,
  currentTrail: HeightsCoordinates,
  currentValue: number,
  trailheadsList: HeightsCoordinates[]
): boolean => {
  const x = x0;
  const y = y0;

  //Verify that the cell visited exists and it hasn't been already visited
  if (
    !verifyPosition(matrix, x, y) ||
    visitedHeights.has(`${x}, ${y}`) ||
    currentTrail.has(`${x},${y}`) ||
    matrix[y][x] !== currentValue
  ) {
    return false;
  }

  //Add the cell to the visited positions Set
  currentTrail.add(`${x},${y}`);

  //If the cell is a 9, add 1 to the trailheads counter
  if (matrix[y][x] === 9 && currentValue === 9) {
    trailheadsList.push(new Set(currentTrail));
    return true;
  }

  //Explore adjacent cells
  const directions = Object.values(CARDINALS);
  for (const direction of directions) {
    const newX = x + direction.x;
    const newY = y + direction.y;

    if (
      trailheadsDFS(
        matrix,
        newX,
        newY,
        visitedHeights,
        currentTrail,
        currentValue + 1,
        trailheadsList
      )
    ) {
      return true;
    }
  }
  currentTrail.delete(`${x}, ${y}`);
  return false;
};

const main = async (filePath: string) => {
  const matrix = await getFormattedInput(filePath);
  const visitedHeights: HeightsCoordinates = new Set();
  const trailheads: HeightsCoordinates[] = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === 0) {
        const currentTrail: HeightsCoordinates = new Set();
        trailheadsDFS(
          matrix,
          x,
          y,
          visitedHeights,
          currentTrail,
          0,
          trailheads
        );
        for (const coord of currentTrail) {
          visitedHeights.add(coord);
        }
      }
    }
  }

  console.log("Total trailheads found:", trailheads.length);
  for (const [index, trailhead] of trailheads.entries()) {
    console.log(`Trailhead ${index + 1}:`, [...trailhead]);
  }
};

// main("./input-example.txt");
main("./input.txt");
