export interface IAuthInfo {
  userId: string,
  email: string,
  isActivated: boolean,
}

export interface IJwtPayload extends IAuthInfo {
  isRefreshToken?: boolean,
  iat?: number,
  exp?: number,
}

export interface IJwtAccess {
  access_token: string;
  refresh_token: string;
  expires_after: string;
  refresh_before: string;
}

export interface IActivationResult {
  isActivated: boolean;
}
