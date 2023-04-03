import { isSSR } from "./ssr";

export function isDevelopment(): boolean {
  if (isSSR()) {
    return process.env.NODE_ENV === "development";
  }
  return location.hostname === "localhost";
}
