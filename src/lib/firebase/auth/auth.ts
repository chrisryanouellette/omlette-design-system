import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import nookies from "nookies";
import {
  getAuthorizationTokenFromHeaders,
  getSessionToken,
  verifyAuthenticationToken,
} from "../auth/token";
import { initializeFirebaseAdmin } from "../initialize/ssr";

const ONE_DAYS_IN_MS = 60 * 60 * 24 * 1000;

/**
 * Takes a token from the authorization header and uses it to authenticate
 * with the firebase server.
 *
 * A session token is then set in the client which is used to check authorization
 * on protected routes.
 */
export async function authenticate(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  initializeFirebaseAdmin();
  const token = getAuthorizationTokenFromHeaders(req);
  await verifyAuthenticationToken(token);
  const sessionToken = await getSessionToken(token, ONE_DAYS_IN_MS);
  nookies.set({ res }, "auth", sessionToken, {
    secure: process.env.NODE_ENV !== "development",
    path: "/",
    httpOnly: true,
    maxAge: ONE_DAYS_IN_MS,
    sameSite: "lax",
  });
}

/** Destroys the cookie on the client so they can no longer access protected routes */
export function unauthenticate(
  ctx: { req: NextApiRequest } | GetServerSidePropsContext,
  res: NextApiResponse
): void {
  nookies.destroy({ res }, "auth", { path: "/" });
}
