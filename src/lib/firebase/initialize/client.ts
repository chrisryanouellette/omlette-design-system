import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { isSSR } from "@Utilities";

const subs = new Set<() => void>();

export let firebaseClient: FirebaseApp;

export type InitializeFirebaseClientArgs = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  measurementId: string;
};

export function initializeFirebaseClient(
  args: InitializeFirebaseClientArgs,
  init: typeof initializeApp = initializeApp
): FirebaseApp {
  if (!isSSR()) {
    if (!getApps().length) {
      firebaseClient = init(args);
      subs.forEach((sub) => sub());
      return firebaseClient;
    }
  }
  return firebaseClient;
}

/**
 * Allows us to pause the execution of modular functions that depend on the
 * firebase client SDK to be initialized before running
 */
export function subscribeToFirebaseClientInit(sub: () => void): () => void {
  subs.add(sub);
  return () => subs.delete(sub);
}
