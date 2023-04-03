import { useCallback, useMemo } from "react";
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  Unsubscribe,
  User as FirebaseUser,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createGlobalStore, UseCreateStore, isSSR } from "@Utilities";
import {
  firebaseClient,
  User,
  normalizeUser,
  subscribeToFirebaseClientInit,
} from "@Lib";

type UserStore = User | null;
type AuthStore = { loginApiRoute: string };

const provider = new GoogleAuthProvider();
export const userStore = createGlobalStore<UserStore>(null);
export const authStore = createGlobalStore<AuthStore>({
  loginApiRoute: "/api/login",
});

let unsubscribeFromAuthChanges: Unsubscribe;
/**
 * Handle auth state changes so they won't fire multiple times in
 * a useEffect.
 */
function subscribeToUserStateChanges(): Unsubscribe {
  unsubscribeFromAuthChanges = getAuth(firebaseClient).onAuthStateChanged(
    async (user) => {
      if (user) {
        try {
          console.log("user changed");
          await loginUserFromAuthChange(user);
          return userStore.set(normalizeUser(user));
        } catch (error) {
          // Log to analytics service
          console.error(error);
        }
      }
      return userStore.set(null);
    }
  );
  return unsubscribeFromAuthChanges;
}
if (!isSSR()) {
  subscribeToFirebaseClientInit(subscribeToUserStateChanges);
}

async function fetchLoginUser(token: string): Promise<void> {
  const route = authStore.get().loginApiRoute;
  await fetch(route, {
    credentials: "same-origin",
    headers: new Headers({
      authorization: token,
    }),
  });
}

export async function loadUserFromRedirect(): Promise<void> {
  const auth = getAuth(firebaseClient);
  const result = await getRedirectResult(auth);
  if (result) {
    const token = await result.user.getIdToken();
    await fetchLoginUser(token);
    subscribeToUserStateChanges();
    userStore.set(normalizeUser(result.user));
  }
}

export async function loginUserFromAuthChange(
  user: FirebaseUser
): Promise<void> {
  const token = await user.getIdToken();
  await fetchLoginUser(token);
}

export async function login(): Promise<void> {
  const auth = getAuth(firebaseClient);
  await signInWithRedirect(auth, provider);
}

export async function logout(): Promise<void> {
  const auth = getAuth(firebaseClient);
  signOut(auth);
  await fetch("/api/logout");
  unsubscribeFromAuthChanges();
  userStore.set(null);
}

export type UseUser = {
  store: UseCreateStore<UserStore>;
  login: typeof login;
  logout: (redirect?: string) => void;
};

export function useUser(): UseUser {
  const router = useRouter();

  const userLogout = useCallback<UseUser["logout"]>(
    async function (redirect = "/") {
      try {
        await logout();
        router.push(redirect);
      } catch (error) {
        console.error(error);
      }
    },
    [router]
  );

  return useMemo(
    () => ({ store: userStore, login, logout: userLogout }),
    [userLogout]
  );
}
