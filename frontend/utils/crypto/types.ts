export interface IEncrypted {
  cipher: ArrayBuffer;
  iv: Uint8Array;
}

export interface IJWTPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  auth_time: number;
  at_hash: string;
}

export interface IJwk {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}
