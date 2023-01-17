import { NextApiRequest, NextApiResponse } from 'next';
import auth from '../../../auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const { authCode, codeVerifier } = req.body;
  if (!authCode || !codeVerifier) {
    res.status(400).json({ error: 'Missing parameters' });
  }

  const data = await auth.fetchAccessToken(authCode, codeVerifier);

  res.status(200).json(data);
}
