import * as admin from "firebase-admin";
import { App as FirebaseAdminApp, getApps } from "firebase-admin/app";
import { getFirebaseAdminConfig } from ".";
import { isSSR } from "@Utilities";

export let firebaseAdmin: FirebaseAdminApp;

export function initializeFirebaseAdmin(): FirebaseAdminApp | void {
  const firebaseAdminConfig = getFirebaseAdminConfig();
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
