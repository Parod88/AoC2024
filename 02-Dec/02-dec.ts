type Data = Report[];
type Report = Level[];
type Level = number;

let safeReports: number = 0;

const formattedInput = async (filepath: string) => {
  const inputString: string = await Deno.readTextFile(filepath);

  const data: Data = inputString
    .split("\n")
    .map((report) => report.split(" ").map((level) => parseInt(level)));

  return data;
};

const evalProgression = (report: Report) => {
  let isIncreasing = true;
  let isDecreasing = true;

  for (let i = 1; i < report.length; i++) {
    if (report[i] >= report[i - 1]) {
      isDecreasing = false;
    }
    if (report[i] <= report[i - 1]) {
      isIncreasing = false;
    }

    if (!isIncreasing && !isDecreasing) {
      return false;
    }
  }

  return true;
};

const evalDifference = (report: Report) => {
  for (let i = 1; i < report.length; i++) {
    if (Math.abs(report[i] - report[i - 1]) > 3) {
      return false;
    }
  }
  return true;
};

const evalSafety = (report: Report) => {
  const enhancedReports: Data = [];

  if (evalDifference(report) && evalProgression(report)) {
    return (safeReports += 1);
  } else {
    for (let i = 0; i < report.length; i++) {
      enhancedReports.push(report.filter((_, index) => index !== i));
    }

    let continueWhile = true;
    let j = 0;
    while (j < report.length && continueWhile) {
      if (
        evalDifference(enhancedReports[j]) &&
        evalProgression(enhancedReports[j])
      ) {
        continueWhile = false;
        return (safeReports += 1);
      } else j++;
    }
  }
  return false;
};

const countSafeReports = (data: Data) => {
  data.forEach((report: Report) => {
    evalSafety(report);
  });
  console.log("safe reports:", safeReports);
  return;
};

async function processFile(filePath: string) {
  const input = await formattedInput(filePath);
  countSafeReports(input);
}

// processFile("./input_example.txt");
processFile("./input.txt");
// processFile(
//   "/home/pablo/Escritorio/personal_repositories/AoC2024/02-Dec/input.txt"
// );
