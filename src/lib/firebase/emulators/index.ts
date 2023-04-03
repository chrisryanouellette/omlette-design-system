import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { firebaseClient } from "../initialize";
import { InitEmulatorsArgs } from "./types";

export function initClientEmulators({
  enableAuth,
  enableFirestore,
}: InitEmulatorsArgs): void {
  if (window.location.hostname !== "localhost") {
    console.warn(
      "Firebase client emulators are being initialized in a non-development environment."
    );
  }

  if (enableAuth) {
    const { host = "localhost", port = 9099 } =
      typeof enableAuth === "object" ? enableAuth : {};
    const auth = getAuth(firebaseClient);
    connectAuthEmulator(auth, `http://${host}:${port}`);
  }

  if (enableFirestore) {
    const { host = "localhost", port = 8080 } =
      typeof enableFirestore === "object" ? enableFirestore : {};
    const db = getFirestore();
    connectFirestoreEmulator(db, host, port);
  }
}
