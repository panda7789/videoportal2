// eslint-disable-next-line import/prefer-default-export
export function NumberToWords(input: number): string {
  if (input > 999999) {
    return `${(input / 1000000).toFixed(1)} mil.`;
  }
  if (input > 999) {
    return `${(input / 1000).toFixed(1)} tis.`;
  }
  return `${input.toFixed(1)}`;
}

export function SizeToWords(input: number): string {
  if (input >= 1e6) {
    return `${(input / 1e6).toFixed(1)} MB`;
  }
  if (input >= 1e3) {
    return `${(input / 1e3).toFixed(1)} KB`;
  }
  return `${input.toFixed(1)} B`;
}

export function TimeSpanToReadableFormat(input: string, includeHours = false): string {
  // eslint-disable-next-line prefer-template
  return includeHours ? input : input.slice(3);
}

export function TimestampToAgoWords(input: number): string {
  const now = Date.now();
  const diff = new Date(now - input);
  const years = diff.getFullYear() - 1970;
  if (years > 0) {
    if (years === 1) {
      return `před 1 rokem`;
    }
    return `před ${years} lety`;
  }
  const months = diff.getMonth();
  if (months > 0) {
    if (months === 1) {
      return `před 1 měsícem`;
    }
    return `před ${months} měsíci`;
  }
  const days = diff.getDate() - 1;
  if (days > 0) {
    if (days === 1) {
      return `před 1 dnem`;
    }
    return `před ${days} dny`;
  }
  const hours = diff.getHours();
  if (hours > 0) {
    if (hours === 1) {
      return `před 1 hodinou`;
    }
    return `před ${hours} hodinami`;
  }
  const minutes = diff.getMinutes();
  if (minutes <= 1) {
    return `před 1 minutou`;
  }
  return `před ${minutes} minutami`;
}
