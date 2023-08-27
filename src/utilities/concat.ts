import { twMerge } from "tailwind-merge";

function concat(...strings: (string | string[] | false | undefined)[]): string {
  return twMerge(strings.flat().filter(Boolean));
}

export { concat };
