import * as admin from "firebase-admin";
import { App as FirebaseAdminApp, getApps } from "firebase-admin/app";
import { isSSR } from "@Utilities";

export type FirebaseAdminConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL: string;
};

let firebaseAdminConfig: FirebaseAdminConfig;
export let firebaseAdmin: FirebaseAdminApp;

export function setFirebaseAdminConfig(config: FirebaseAdminConfig): void {
  firebaseAdminConfig = config;
}

export function initializeFirebaseAdmin(): FirebaseAdminApp | void {
  if (isSSR()) {
    if (!getApps().length) {
      if (!firebaseAdminConfig) {
        throw new Error(
          `The firebase admin config has not been set. Call "setFirebaseAdminConfig" before initializing the admin.`
        );
      }
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseAdminConfig.projectId,
          clientEmail: firebaseAdminConfig.clientEmail,
          privateKey: firebaseAdminConfig.privateKey,
        }),
        databaseURL: firebaseAdminConfig.databaseURL,
      });
      return firebaseAdmin;
    }
  }
}
