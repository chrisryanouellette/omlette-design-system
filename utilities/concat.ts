function concat(...strings: (string | false | undefined)[]): string {
  return strings.filter(Boolean).join(" ");
}

export { concat };
