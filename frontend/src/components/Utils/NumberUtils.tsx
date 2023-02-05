// eslint-disable-next-line import/prefer-default-export
export function NumberToWords(input: number): string {
  if (input > 999999) {
    return `${input / 1000000} mil.`;
  }
  if (input > 999) {
    return `${input / 1000} tis.`;
  }
  return `${input}`;
}
