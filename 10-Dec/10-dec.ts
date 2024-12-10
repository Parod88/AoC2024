import { fromFileUrl } from "@std/path";

type Matrix = number[][];
type Direction = { x: number; y: number };
type CardinalOrientation = "UP" | "RIGHT" | "DOWN" | "LEFT";

type DiagonalOrientation = "UP_LEFT" | "UP_RIGHT" | "DOWN_RIGHT" | "DOWN_LEFT";

type VisitedHeights = Set<string>;

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
  visitedHeights: VisitedHeights
) => {
  let totalTrailHeads = 0;

  let x = x0;
  let y = y0;

  //Verify that the cell visited exists and it hasn't been already visited
  if (!verifyPosition(matrix, x, y) || visitedHeights.has(`${x}, ${y}`)) {
    return 0;
  }

  //Add the cell to the visited positions Set
  visitedHeights.add(`${x},${y}`);

  //If the cell is a 9, add 1 to the trailheads counter
  if (matrix[y][x] === 9) {
    totalTrailHeads += 1;
  }

  //Explore adjacent cells
  const directions = Object.values(CARDINALS);
  for (const direction of directions) {
    const newX = x + direction.x;
    const newY = y + direction.y;

    //Verify that the adjacent cell is +1 higher than the current one
    if (
      verifyPosition(matrix, newX, newY) &&
      matrix[newY][newX] === matrix[y][x] + 1
    ) {
      //Recursively call to explore the adjacent cell
      totalTrailHeads += trailheadsDFS(matrix, newX, newY, visitedHeights);
    }
  }

  //Return the total number of trailheads found on this recursive branch
  return totalTrailHeads;
};

const main = async () => {
  const matrix = await getFormattedInput("./input-example.txt");
  const visitedHeights = new Set<string>();
  let totalTrailHeads = 0;

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === 9 && !visitedHeights.has(`${x},${y}`)) {
        totalTrailHeads += trailheadsDFS(matrix, x, y, visitedHeights);
      }
    }
  }

  console.log("Total trailheads found:", totalTrailHeads);
};

main().catch((error) => {
  console.error("Error ejecutando el programa:", error);
});
