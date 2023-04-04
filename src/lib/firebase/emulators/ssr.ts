import { InitEmulatorsArgs } from "./types";

export function initServerEmulators({
  enableAuth,
  enableFirestore,
}: InitEmulatorsArgs): void {
  if (process.env.NODE_ENV !== "development") {
    console.warn(
      `Firebase server emulators are being setup in a non-development enviorment.`
    );
  }

  if (enableAuth) {
    const { host = "localhost", port = 9099 } =
      typeof enableAuth === "object" ? enableAuth : {};
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] = `${host}:${port}`;
  }

  if (enableFirestore) {
    const { host = "localhost", port = 8080 } =
      typeof enableFirestore === "object" ? enableFirestore : {};
    process.env["FIRESTORE_EMULATOR_HOST"] = `${host}:${port}`;
  }
}