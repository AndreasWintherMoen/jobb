interface IEncrypted {
  cipher: ArrayBuffer;
  iv: Uint8Array;
}

const ivLength = 12;
const secretKeyString = process.env.ENCRYPTION_KEY;
if (!secretKeyString) {
  throw new Error('Encryption key is not set');
}

function generateCryptoKey(cryptoModule: Crypto) {
  const encodedSecret = encode(secretKeyString!);
  return cryptoModule.subtle.importKey(
    'raw',
    encodedSecret,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
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

export async function encrypt(
  data: string,
  cryptoModule: Crypto,
  isEdgeRuntime?: boolean
): Promise<string> {
  const encoded = encode(data);
  const iv = generateIv(cryptoModule);
  const key = await generateCryptoKey(cryptoModule);
  const cipher = await cryptoModule.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded
  );
  console.log('cipher', cipher);
  console.log('iv', iv);
  return stringifyEncrypted({ cipher, iv }, !!isEdgeRuntime);
}

export async function decrypt(
  encryptedString: string,
  cryptoModule: Crypto,
  isEdgeRuntime?: boolean
): Promise<string> {
  const encryptedMessage = parseEncrypted(encryptedString, !!isEdgeRuntime);
  const { cipher, iv } = encryptedMessage;
  console.log('cipher', cipher);
  console.log('iv', iv);
  const key = await generateCryptoKey(crypto);
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
