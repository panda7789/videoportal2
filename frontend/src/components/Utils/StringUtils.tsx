// eslint-disable-next-line import/prefer-default-export
export function GetInitials(input: string | undefined) {
  if (!input) {
    return undefined;
  }
  return input.indexOf(' ') > 0 ? `${input[0]}${input[input.indexOf(' ') + 1]}` : input[0];
}
