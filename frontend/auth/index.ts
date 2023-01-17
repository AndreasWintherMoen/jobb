interface IJwtResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: string;
}

class Auth {
  private owTokenURL: string;
  private owUserInfoURL: string;
  private clientID: string;
  private redirectURI: string;
  private jwtData: IJwtResponse | undefined;

  constructor() {
    const { OW_TOKEN_URL, CLIENT_ID, REDIRECT_URI, OW_USERINFO_URL } =
      process.env;
    if (!OW_TOKEN_URL || !CLIENT_ID || !REDIRECT_URI || !OW_USERINFO_URL)
      throw new Error('Missing auth environment variables');
    this.owTokenURL = OW_TOKEN_URL;
    this.owUserInfoURL = OW_USERINFO_URL;
    this.clientID = CLIENT_ID;
    this.redirectURI = REDIRECT_URI;
  }

  public async fetchAccessToken(authCode: string, codeVerifier: string) {
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
    console.log(data);

    return data;
  }
}

const auth = new Auth();

export default auth;
