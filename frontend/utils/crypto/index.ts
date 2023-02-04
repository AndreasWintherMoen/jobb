import { IEncrypted, IJwk, IJWTPayload } from './types';

const ivLength = 12;
const secretKeyString = process.env.ENCRYPTION_KEY;
if (!secretKeyString) {
  throw new Error('Encryption key is not set');
}

class JWK {
  private jwks: IJwk[];
  private owJwkUrl: string;

  constructor() {
    this.jwks = [];
    const { OW_JWK_URL } = process.env;
    if (!OW_JWK_URL) throw new Error('Missing OW_JWK_URL environment variable');
    this.owJwkUrl = OW_JWK_URL;
  }

  private async fetchOwJwks(): Promise<IJwk[]> {
    return fetch(this.owJwkUrl, {
      cache: 'force-cache',
    })
      .then((res) => res.json())
      .then((res) => res.keys);
  }

  public async getOwJwks(): Promise<IJwk[]> {
    if (this.jwks.length === 0) {
      this.jwks = await this.fetchOwJwks();
    }
    return this.jwks;
  }

  public async refreshJwk(): Promise<void> {
    this.jwks = await this.fetchOwJwks();
  }
}

const jwk = new JWK();

function generateEncryptionKey(cryptoModule: Crypto) {
  const encodedSecret = encode(secretKeyString!);
  return cryptoModule.subtle.importKey(
    'raw',
    encodedSecret,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

async function generateJwtVerificationKey(
  cryptoModule: Crypto,
  kid: string
): Promise<CryptoKey> {
  const keys = await jwk.getOwJwks();
  const matchingKey = keys.find((key) => key.kid === kid);
  if (!matchingKey) {
    return Promise.reject(new Error('No matching key found'));
  }
  return cryptoModule.subtle.importKey(
    'jwk',
    matchingKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    false,
    ['verify']
  );
}

function encode(data: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(data);
}

function decode(data: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(data);
}

function generateIv(cryptoModule: Crypto) {
  return cryptoModule.getRandomValues(new Uint8Array(ivLength));
}

function pack(buffer: ArrayBuffer | Uint8Array): string {
  return Buffer.from(buffer).toString('base64');
}

function unpack(packed: string): ArrayBuffer {
  return Buffer.from(packed, 'base64');
}

// For middleware which runs on Next's edge runtime environment as opposed to Node, we need to use atob and btoa because
// the Buffer class is not available.
function edgeRuntimeCompatiblePack(buffer: ArrayBuffer | Uint8Array): string {
  return btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );
}

function edgeRuntimeCompatibleUnpack(string: string): ArrayBuffer {
  var binaryString = atob(string);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function stringifyEncrypted(
  encrypted: IEncrypted,
  isEdgeRuntime: boolean
): string {
  const packedIv = isEdgeRuntime
    ? edgeRuntimeCompatiblePack(encrypted.iv)
    : pack(encrypted.iv);
  const packedCipher = isEdgeRuntime
    ? edgeRuntimeCompatiblePack(encrypted.cipher)
    : pack(encrypted.cipher);
  const packedMessage = `${packedIv}${packedCipher}`;
  return packedMessage;
}

function parseEncrypted(
  packedMessage: string,
  isEdgeRuntime: boolean
): IEncrypted {
  const unpackedMessage = isEdgeRuntime
    ? edgeRuntimeCompatibleUnpack(packedMessage)
    : unpack(packedMessage);
  const ivArrayBuffer = unpackedMessage.slice(0, ivLength);
  const iv = new Uint8Array(ivArrayBuffer);
  const cipher = unpackedMessage.slice(ivLength);
  return {
    iv,
    cipher,
  };
}

function encodeJwtData(jwt: string): Uint8Array {
  const encoder = new TextEncoder();
  const data = jwt.split('.').slice(0, 2).join('.');
  return encoder.encode(data);
}

function unpackJwtSignature(jwt: string, isEdgeRuntime: boolean): ArrayBuffer {
  const rawSignature = jwt.split('.')[2];
  if (isEdgeRuntime) return edgeRuntimeCompatibleUnpack(rawSignature);
  return unpack(rawSignature);
}

export async function encrypt(
  data: string,
  cryptoModule: Crypto,
  isEdgeRuntime?: boolean
): Promise<string> {
  const encoded = encode(data);
  const iv = generateIv(cryptoModule);
  const key = await generateEncryptionKey(cryptoModule);
  const cipher = await cryptoModule.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded
  );
  return stringifyEncrypted({ cipher, iv }, !!isEdgeRuntime);
}

export async function decrypt(
  encryptedString: string,
  cryptoModule: Crypto,
  isEdgeRuntime?: boolean
): Promise<string> {
  const encryptedMessage = parseEncrypted(encryptedString, !!isEdgeRuntime);
  const { cipher, iv } = encryptedMessage;
  const key = await generateEncryptionKey(cryptoModule);
  const encoded = await cryptoModule.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    cipher
  );
  return decode(encoded);
}

export function parseJWTPayload(jwt: string): IJWTPayload {
  const payload = jwt.split('.')[1];
  const base64Payload = payload.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64Payload)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload);
}

function parseJWTHeaderKid(jwt: string): string {
  const header = jwt.split('.')[0];
  const base64Header = header.replace(/-/g, '+').replace(/_/g, '/');
  var jsonHeader = decodeURIComponent(
    atob(base64Header)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonHeader).kid;
}

export async function verifyOWJwtSignature(
  jwt: string,
  cryptoModule: Crypto,
  isEdgeRuntime?: boolean
): Promise<boolean> {
  const signature = unpackJwtSignature(jwt, !!isEdgeRuntime);
  const data = encodeJwtData(jwt);
  const kid = parseJWTHeaderKid(jwt);
  const verify = async () => {
    const publicKey = await generateJwtVerificationKey(cryptoModule, kid);
    return cryptoModule.subtle.verify(
      { name: 'RSASSA-PKCS1-v1_5' },
      publicKey,
      signature,
      data
    );
  };
  return verify()
    .then((isValid) => isValid)
    .catch(() => {
      jwk.refreshJwk();
      return verify()
        .then((isValid) => isValid)
        .catch(() => false);
    });
}
