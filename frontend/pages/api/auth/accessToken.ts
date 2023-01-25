import { NextApiRequest, NextApiResponse } from 'next';
import auth from '../../../auth';
import { encrypt } from '../../../utils/crypto';
import cryptoModule from '../../../utils/crypto/nodeCryptoModule';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }
  const { authCode, codeVerifier } = req.body;
  if (!authCode || !codeVerifier) {
    res.status(400).json({
      error: `Missing parameters. Provided authCode: ${authCode}. Provided codeVerifier: ${codeVerifier}`,
    });
  }

  try {
    const data = await auth.fetchAccessToken(authCode, codeVerifier);
    const encryptedAccessToken = await encrypt(data.access_token, cryptoModule);
    const encryptedRefreshToken = await encrypt(
      data.refresh_token,
      cryptoModule
    );

    const encryptedData = {
      ...data,
      access_token: encryptedAccessToken,
      refresh_token: encryptedRefreshToken,
    };
    res.status(200).json(encryptedData);
  } catch (error) {
    res.status(500).json({ error });
  }
}
