import { GetServerSidePropsContext, NextApiRequest } from "next";
import { parseCookies } from "nookies";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { normalizeUser, User } from "./user";

export async function verifyAuthenticationToken(
  token: string
): Promise<DecodedIdToken> {
  const firebaseAdminAuth = getAuth();
  return await firebaseAdminAuth.verifyIdToken(token, true);
}

export async function verifySessionToken(
  token: string
): Promise<DecodedIdToken> {
  const firebaseAdminAuth = getAuth();
  return await firebaseAdminAuth.verifySessionCookie(token, true);
}

export async function getUserFromTokenDecodedAuthenticationToken(
  token: DecodedIdToken
): Promise<User> {
  const firebaseAdminAuth = getAuth();
  const user = await firebaseAdminAuth.getUser(token.uid);
  return normalizeUser(user);
}

export function getAuthorizationTokenFromHeaders(req: NextApiRequest): string {
  const token = req.headers.authorization;
  if (!token) {
    throw new Error("The authorization header was not set.");
  }
  return token;
}

export function getAuthorizationTokenFromCookies(
  ctx: GetServerSidePropsContext | { req: NextApiRequest },
  name: string
): string {
  const cookies = parseCookies(ctx);
  const cookie = cookies[name];
  if (!cookie) {
    throw new Error(`Cookie with name "${name}" has not been set.`);
  }
  return cookie;
}

export async function getSessionToken(
  token: string,
  expiration: number
): Promise<string> {
  const firebaseAdminAuth = getAuth();
  return await firebaseAdminAuth.createSessionCookie(token, {
    expiresIn: expiration,
  });
}
