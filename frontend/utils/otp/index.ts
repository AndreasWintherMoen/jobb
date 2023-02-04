import { decrypt, encrypt } from '../crypto';
import nodeCryptoModule from '../crypto/nodeCryptoModule';
import { OTP, OTPResponse } from './types';

function generateCode() {
  let otp = '';
  for (let i = 0; i < 5; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

export async function generateEncryptedOtp(phoneNumber: string): Promise<OTP> {
  const code = generateCode();
  const ttl = 60 * 5; // 5 minutes
  const expirationTime = Math.floor(Date.now() / 1000) + ttl;
  const data = `${phoneNumber}.${code}.${expirationTime}`;
  const cipher = await encrypt(data, nodeCryptoModule);
  return { cipher, code };
}

export async function verifyOtp(
  otp: OTP,
  phoneNumber: string
): Promise<OTPResponse> {
  const { cipher, code } = otp;
  const data = await decrypt(cipher, nodeCryptoModule);
  const [originalPhoneNumber, originalCode, expirationTime] = data.split('.');
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (currentTimestamp > Number(expirationTime)) {
    return { isValid: false, httpCode: 410 };
  }
  const isValid = code === originalCode && phoneNumber === originalPhoneNumber;
  if (!isValid) return { isValid, httpCode: 401 };
  return { isValid, httpCode: 200 };
}
