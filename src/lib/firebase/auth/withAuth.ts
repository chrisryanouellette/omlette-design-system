import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { initializeFirebaseAdmin } from "../initialize/admin";
import { User } from "./user";
import {
  getAuthorizationTokenFromCookies,
  getUserFromTokenDecodedAuthenticationToken,
  verifySessionToken,
} from "./token";
import { authenticate } from "./auth";

interface AuthError extends Error {
  code: string;
}

function isAuthError(error: unknown): error is AuthError {
  if (error && typeof error === "object" && "code" in error) return true;
  return false;
}

type WithAuthOptions = {
  whenAuthed?: "redirect";
  authedRedirectRoute?: string;
  whenUnauthed?: "redirect";
  unauthedRedirectRoute?: string;
};

export type WithAuthArgs<U> = {
  ctx: GetServerSidePropsContext;
  user: U;
};

/** The callback that is given to the withAuth function */
type GetServerSidePropsFn<U, T extends { [key: string]: unknown }> = (
  args: WithAuthArgs<U>
) => Promise<GetServerSidePropsResult<T>>;
/** The wrapper that is executed to check if the user is authenticated */
type Wrapped<U, T extends { [key: string]: unknown }> = (
  cb: GetServerSidePropsFn<U, T>
) => GetServerSideProps<T>;

/**
 * We overload the function so that based on what args are set we know
 * if the user object is expected to be present.
 */
function withAuth<T extends { [key: string]: unknown }>(
  options: WithAuthOptions
): Wrapped<User, T>;
function withAuth<T extends { [key: string]: unknown }>(
  options?: null
): Wrapped<User | null, T>;
function withAuth<T extends { [key: string]: unknown }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any
): Wrapped<User | null, T> {
  return (cb: GetServerSidePropsFn<User | null, T>) =>
    async (
      ctx: GetServerSidePropsContext
    ): Promise<GetServerSidePropsResult<T>> => {
      let user: User | null = null;
      try {
        initializeFirebaseAdmin();
        const token = getAuthorizationTokenFromCookies(ctx, "auth");
        const decoded = await verifySessionToken(token);
        user = await getUserFromTokenDecodedAuthenticationToken(decoded);
        if (!user) {
          throw new Error("Enable to get user.");
        }
        if (options?.whenAuthed === "redirect") {
          return {
            redirect: {
              permanent: false,
              destination: options?.authedRedirectRoute ?? "/",
            },
          };
        }
      } catch (error) {
        if (isAuthError(error)) {
          switch (error.code) {
            case "auth/session-cookie-expired": {
              await authenticate(ctx, ctx.res);
            }
          }
        }
        console.log(error);
        // There was an error with validating the authentication
        if (options?.whenUnauthed === "redirect") {
          return {
            redirect: {
              permanent: true,
              destination: options?.unauthedRedirectRoute ?? "/",
            },
          };
        }
      }

      return await cb({ ctx, user });
    };
}

export { withAuth };
