const patron: RegExp = /mul\(\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*\)/g;
const patronForNumbers: RegExp = /mul\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/;

const formattedInput = async (filePath: string) => {
  const inputString: string = await Deno.readTextFile(filePath);

  const mulList = inputString.match(patron);
  console.log(mulList);
  return mulList;
};

const productList = (mulList: RegExpMatchArray) => {
  const productList = mulList
    .map((mul) => {
      const product = mul.match(patronForNumbers);
      console.log(product);
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

    console.log(finalResult);
    return;
  }

  return;
}

processFile("./input.txt");
