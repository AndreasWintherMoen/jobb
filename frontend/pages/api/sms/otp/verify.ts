import { NextApiRequest, NextApiResponse } from 'next';
import { verifyOtp } from '../../../../utils/otp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cipher, code, phoneNumber } = req.body;
  if (!phoneNumber || !code || !cipher || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid parameters' });
  }

  const otp = { cipher, code };
  const { isValid, httpCode } = await verifyOtp(otp, phoneNumber);

  return res.status(httpCode).json({ isValid });
}
