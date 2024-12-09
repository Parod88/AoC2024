import { fromFileUrl } from "@std/path";

type Row = string[];
type Column = Row[];
type Matrix = string[][];

async function readInput(path: string): Promise<string> {
  const absolutePath = fromFileUrl(import.meta.resolve(path));
  const readInput = await Deno.readTextFile(absolutePath);
  console.log(readInput);
  return readInput;
}

function generateMatrix(input: string) {
  const matrix: Matrix = [];

  const rows = input.split("\n").map((line) => line.split(","));
  for (const row of rows) {
    column.push(row);
    matrix.push(column);

    console.log(rows);
    console.log(matrix);
    return matrix;
  }
}

const input = await readInput("./input-example.txt");
generateMatrix(input);
