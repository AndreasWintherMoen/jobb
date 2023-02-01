import { parseJWTPayload, verifyOWJwtSignature } from '../utils/crypto';

import { IJwtResponse, IUserInfo, IProfile } from './types';

class Auth {
  private owTokenURL: string;
  private owUserInfoURL: string;
  private owProfileURL: string;
  private clientID: string;
  private redirectURI: string;
  private jwtData: IJwtResponse | undefined;
  private userInfo: IUserInfo | undefined;
  private profile: IProfile | undefined;

  constructor() {
    const {
      OW_TOKEN_URL,
      CLIENT_ID,
      REDIRECT_URI,
      OW_USERINFO_URL,
      OW_PROFILE_URL,
    } = process.env;
    if (
      !OW_TOKEN_URL ||
      !CLIENT_ID ||
      !REDIRECT_URI ||
      !OW_USERINFO_URL ||
      !OW_PROFILE_URL
    )
      throw new Error('Missing auth environment variables');
    this.owTokenURL = OW_TOKEN_URL;
    this.owUserInfoURL = OW_USERINFO_URL;
    this.clientID = CLIENT_ID;
    this.redirectURI = REDIRECT_URI;
    this.owProfileURL = OW_PROFILE_URL;
  }

  public async fetchAccessToken(
    authCode: string,
    codeVerifier: string
  ): Promise<IJwtResponse> {
    const url = new URL(this.owTokenURL);

    const body = new FormData();

    body.append('client_id', this.clientID);
    body.append('redirect_uri', this.redirectURI);
    body.append('grant_type', 'authorization_code');
    body.append('code_verifier', codeVerifier);
    body.append('code', authCode);

    const response = await fetch(url.toString(), {
      method: 'POST',
      body,
    });
    if (!response.ok) throw new Error('Failed to fetch access token');

    const data = await response.json();

    this.jwtData = data;

    console.log(data);
    return data;
  }

  public async fetchUser() {
    if (!this.jwtData) throw new Error('No JWT data');

    const url = new URL(this.owUserInfoURL);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.jwtData.access_token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch user');

    const data = await response.json();

    this.userInfo = data;

    return data;
  }

  public async fetchFullProfile(token?: string) {
    if (!this.jwtData && !token)
      throw new Error('No JWT data and no token provided');

    const url = new URL(this.owProfileURL);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.jwtData?.access_token || token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch user');

    const data = await response.json();
    console.log(data);

    this.profile = data;

    return data;
  }
}

export async function verifyJwt(
  token: string,
  cryptoModule: Crypto,
  expirationTime: number
): Promise<boolean> {
  // 1. Verify signature
  const isValidSignature = await verifyOWJwtSignature(token, cryptoModule);
  if (!isValidSignature) return false;

  // 2. Verify audience
  const jwtPayload = parseJWTPayload(token);
  const isValidAudience = jwtPayload.aud === process.env.CLIENT_ID;
  if (!isValidAudience) return false;

  // 3. Verify issued at
  const currentTimestamp = Date.now() / 1000;
  const isValidIssuedAt =
    jwtPayload.iat > Math.floor(currentTimestamp - expirationTime) &&
    jwtPayload.iat < Math.floor(currentTimestamp);
  if (!isValidIssuedAt) return false;

  return true;
}

const auth = new Auth();

export default auth;
