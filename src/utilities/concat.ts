function concat(...strings: (string | string[] | false | undefined)[]): string {
  return strings.flat().filter(Boolean).join(" ");
}

export { concat };
