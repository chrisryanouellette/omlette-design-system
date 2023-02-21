import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { isSSR } from "@Utilities";

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
): FirebaseApp | void {
  if (!isSSR()) {
    if (!getApps().length) {
      firebaseClient = initializeApp(args);
      return firebaseClient;
    }
  }
}
