import ApiError from "common/api-error";
import httpStatus from "http-status";
import {
  createAccessToken,
  createAuthTokens,
  createRefreshToken,
  refreshTokenDurationInMs,
  validateRefreshToken
} from "lib/utils/jwt";
import Token from "./models/token";
import User from "../users/models/user";

export class TokenNamespace {
  public static async generateAuthTokens(userId: string) {
    const accessToken = await createAccessToken({
      id: userId
    });
    const refreshToken = await createRefreshToken({
      id: userId
    });
    await Token.create({
      user_id: userId,
      token: refreshToken,
      expires_on: new Date(Date.now() + refreshTokenDurationInMs)
    });
    return {
      accessToken,
      refreshToken
    };
  }

  public static async refresh(refreshToken: string) {
    const decoded = await validateRefreshToken(refreshToken);
    if (!decoded.id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }
    const user = await User.findById(decoded.id);
    const tokenFromDb = await Token.findOne({
      token: refreshToken,
      user_id: decoded.id
    });
    if (tokenFromDb && user) {
      const hasExpired = new Date(tokenFromDb.expires_on) < new Date();

      if (hasExpired) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
      }
      const authTokens = await createAuthTokens({ id: user.id });
      await Token.create({
        user_id: user._id,
        token: authTokens.refreshToken,
        expires_on: new Date(Date.now() + refreshTokenDurationInMs)
      });
      await Token.findByIdAndUpdate(tokenFromDb.id, {
        last_used_at: new Date(),
        expires_on: new Date(Date.now() - 1000)
      });
      return {
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken
      };
    }
  }

  public static async invalidateRefreshToken(refreshToken: string) {
    const decoded = await validateRefreshToken(refreshToken);
    if (!decoded.id) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }
    const user = await User.findById(decoded.id);
    const tokenFromDb = await Token.findOne({
      token: refreshToken,
      user_id: decoded.id
    });
    if (tokenFromDb && user) {
      const hasExpired = new Date(tokenFromDb.expires_on) < new Date();

      if (hasExpired) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
      }
      await Token.findByIdAndUpdate(tokenFromDb._id, {
        last_used_at: new Date(),
        expires_on: new Date(Date.now() - 1000)
      });
    }
  }
}
