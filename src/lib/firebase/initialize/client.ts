import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { isSSR } from "@Utilities";

const subs = new Set<(firebaseClient: FirebaseApp) => void>();

export let firebaseClient: FirebaseApp;

export type InitializeFirebaseClientArgs = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  measurementId: string;
};

export function initializeFirebaseClient(
  args: InitializeFirebaseClientArgs
): FirebaseApp {
  if (!isSSR()) {
    if (!getApps().length) {
      firebaseClient = initializeApp(args);
      subs.forEach((sub) => sub(firebaseClient));
      subs.clear();
      return firebaseClient;
    }
  }
  return firebaseClient;
}

/**
 * Allows us to pause the execution of modular functions that depend on the
 * firebase client SDK to be initialized before running
 */
export function subscribeToFirebaseClientInit(
  sub: (firebaseClient: FirebaseApp) => void
): (() => void) | void {
  if (getApps().length) {
    sub(firebaseClient);
  } else {
    subs.add(sub);
    return () => subs.delete(sub);
  }
}
