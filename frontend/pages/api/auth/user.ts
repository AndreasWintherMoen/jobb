import { NextApiRequest, NextApiResponse } from 'next';
import auth from '../../../auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await auth.fetchUser();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
}
