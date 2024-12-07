type Data = Report[];
type Report = Level[];
type Level = number;

let safeReports: number = 0;

const formattedInput = async (filepath: string) => {
  const inputString: string = await Deno.readTextFile(filepath);

  const data: Data = inputString
    .split("\n")
    .map((report) => report.split(" ").map((level) => parseInt(level)));
  console.log(data);

  return data;
};

const evalSafety = (report: Report) => {
  if (report.some((level, i) => Math.abs(level - report[i + 1]) > 3)) {
    return false;
  }

  if (
    report.every((_, i) => i === 0 || report[i] > report[i - 1]) ||
    report.every((_, i) => i === 0 || report[i] < report[i - 1])
  ) {
    safeReports += 1;
    return true;
  }

  return false;
};

const countSafeReports = (data: Data) => {
  data.forEach((report: Report) => {
    evalSafety(report);
  });
  console.log(safeReports);
  return;
};

async function processFile(filePath: string) {
  const input = await formattedInput(filePath);
  countSafeReports(input);
}

processFile("./input.txt");
