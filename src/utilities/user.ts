import { useCallback, useEffect, useMemo } from "react";
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createGlobalStore, UseCreateStore } from "./store";
import { firebaseClient, User, normalizeUser } from "@Lib";

type UserStore = User | null;

const provider = new GoogleAuthProvider();
export const userStore = createGlobalStore<UserStore>(null);

export async function loadUserFromRedirect(route: string): Promise<void> {
  const auth = getAuth(firebaseClient);
  const result = await getRedirectResult(auth);
  if (result) {
    const token = await result.user.getIdToken();
    await fetch(route, {
      credentials: "same-origin",
      headers: new Headers({
        authorization: token,
      }),
    });
    userStore.set(normalizeUser(result.user));
  }
}

export async function login(): Promise<void> {
  const auth = getAuth();
  await signInWithRedirect(auth, provider);
}

export async function logout(): Promise<void> {
  const auth = getAuth();
  signOut(auth);
  await fetch("/api/logout");
  userStore.set(null);
}

export type UseUser = {
  store: UseCreateStore<UserStore>;
  login: typeof login;
  logout: (redirect?: string) => void;
};

export function useUser(): UseUser {
  const router = useRouter();

  const logout = useCallback<UseUser["logout"]>(
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

  useEffect(() => {
    const auth = getAuth(firebaseClient);
    return auth.onAuthStateChanged((user) => {
      console.log("auth state change");
      userStore.set(user ? normalizeUser(user) : user);
    });
  }, []);

  return useMemo(() => ({ store: userStore, login, logout }), [logout]);
}
