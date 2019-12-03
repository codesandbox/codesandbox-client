interface Options {
  units?: string[];
  decimalPlaces?: number;
}

export const abbreviateNumber = (
  number: number,
  { units = ['k', 'm', 'b', 't'], decimalPlaces = 0 }: Options = {}
) => {
  const decPlaces = 10 ** decimalPlaces;
  let result: number | string = Math.abs(number);

  for (let i = units.length - 1; i >= 0; i--) {
    const size = 10 ** ((i + 1) * 3);

    if (size <= result) {
      result = Math.round(((result as number) * decPlaces) / size) / decPlaces;

      if (result === 1000 && i < units.length - 1) {
        result = 1;
        i++;
      }

      result = `${result}${units[i]}`;

      break;
    }
  }

  return number < 0 ? `-${result}` : result;
};
