export * from "./client";

export type FirebaseAdminConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL: string;
};

let firebaseAdminConfig: FirebaseAdminConfig;

export function setFirebaseAdminConfig(config: FirebaseAdminConfig): void {
  firebaseAdminConfig = config;
}

export function getFirebaseAdminConfig(): FirebaseAdminConfig {
  return firebaseAdminConfig;
}
