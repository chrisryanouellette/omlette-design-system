import type { UserRecord as AdminFirebaseUser } from "firebase-admin/auth";
import type { User as ClientFirebaseUser } from "firebase/auth";

export type User = {
  id: string;
  email?: string | null;
  emailVerified?: boolean;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

export function normalizeUser<T extends AdminFirebaseUser | ClientFirebaseUser>(
  user: T
): User {
  return {
    id: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}