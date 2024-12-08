const pattern: RegExp = /mul\(\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*\)/g;
const patternForNumbers: RegExp = /mul\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/;
const dontDoPattern: RegExp = /don't\(\)(?:[\s\S]*?do\(\))/g;

const filterByDontDo = (inputString: string) => {
  const filteredString = inputString.replace(dontDoPattern, "");
  return filteredString;
};

const formattedInput = async (filePath: string) => {
  const inputString: string = await Deno.readTextFile(filePath);

  const filteredInput = filterByDontDo(inputString);

  const mulList = filteredInput.match(pattern);
  return mulList;
};

const productList = (mulList: RegExpMatchArray) => {
  const productList = mulList
    .map((mul) => {
      const product = mul.match(patternForNumbers);
      if (product) {
        const num1 = parseInt(product[1], 10);
        const num2 = parseInt(product[2], 10);
        return [num1, num2];
      }
      return null;
    })
    .filter(Boolean);
  return productList;
};

async function processFile(filepath: string) {
  const input = await formattedInput(filepath);
  if (input) {
    const finalResult = productList(input)
      .map((product) => product!.reduce((num1, num2) => num1 * num2))
      .reduce((a, b) => a + b);

    console.log("Total product is:", finalResult);
    return;
  }

  return;
}

processFile("./input.txt");
// processFile("./input_example.txt");
