import { config } from "config";
import { SignJWT, jwtVerify } from "jose";

const isDev = () => config.env === "development";

export const refreshTokenDurationInMs = 60 * 60 * 24 * 30 * 1000; // 30 days

export const createAccessToken = (user: { id: string }) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = isDev() ? iat + 60 * 60 * 24 * 1 : iat + 60 * 60 * 24 * 3; // expire access token in 3 days for production and 1 day for development

  return new SignJWT({ payload: { id: user.id } })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(config.accessTokenSecret));
};

export const validateAccessToken = async (jwt: string) => {
  const { payload } = await jwtVerify(jwt, new TextEncoder().encode(config.accessTokenSecret));

  return payload.payload as any;
};

export const createRefreshToken = (user: { id: string }) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + refreshTokenDurationInMs / 1000;

  return new SignJWT({ payload: { id: user.id } })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(config.refreshTokenSecret));
};

export const validateRefreshToken = async (jwt: string) => {
  const { payload } = await jwtVerify(jwt, new TextEncoder().encode(config.refreshTokenSecret));

  return payload.payload as any;
};

export const createAuthTokens = async (user: { id: string }) => {
  const refreshToken = await createRefreshToken(user);
  const accessToken = await createAccessToken(user);
  return {
    refreshToken,
    accessToken
  };
};
