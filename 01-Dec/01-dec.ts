type Serie = number[];
const distances: number[] = [];

async function loadInput(filePath: string) {
  const inputString = await Deno.readTextFile(filePath);

  const leftSerie: Serie = [];
  const rightSerie: Serie = [];

  inputString.split("\n").forEach((line) => {
    const [left, right] = line.split(/\s+/);
    leftSerie.push(Number(left));
    rightSerie.push(Number(right));
  });
  return [leftSerie, rightSerie];
}

function orderSeries(series: [Serie, Serie]) {
  const orderedSeries = series.map((serie) => serie.sort((a, b) => a - b));
  return orderedSeries;
}

function solveFirstPart(seriesToCompare: [Serie, Serie]) {
  const [left, right] = seriesToCompare;
  for (let i = 0; i < left.length; i++) {
    distances.push(Math.abs(right[i] - left[i]));
  }

  const totalDistance = distances.reduce((a, b) => a + b);

  console.log(`Total distances between lists ---> ${totalDistance}`);
  return;
}

function countSimilarities(arr: number[], value: number) {
  return arr.filter((number) => number === value).length;
}

function solveSecondPart(seriesToCompare: [Serie, Serie]) {
  const [left, right] = seriesToCompare;
  const similaritysArr = [];
  for (let i = 0; i < left.length; i++) {
    countSimilarities(right, left[i]);
    if (countSimilarities(right, left[i]) !== 0)
      similaritysArr.push(countSimilarities(right, left[i]) * left[i]);
  }
  const similarityScore = similaritysArr.reduce((a, b) => a + b);
  console.log(`This is the similarity score ---> ${similarityScore}`);
  return;
}

async function processFile(filePath: string) {
  const input = await loadInput(filePath);

  const orderedSeries = orderSeries(input as [Serie, Serie]);

  solveFirstPart(orderedSeries as [Serie, Serie]);

  solveSecondPart(orderedSeries as [Serie, Serie]);
}

processFile("./input.txt");
