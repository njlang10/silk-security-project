export function dbStringToHumanReadableString(header: string): string {
  const replacedUnderscore = header.replace(/_/g, " ");
  const withCapital = replacedUnderscore.split(" ").map((word) => {
    const firstLetter = word[0].toLocaleUpperCase();
    const allOtherLetters = word.slice(1);
    return firstLetter + allOtherLetters;
  });

  return withCapital.join(" ");
}
