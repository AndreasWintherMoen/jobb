import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    res.status(400).json({ error: 'Missing parameters' });
  }

  // const data = await auth.verifyPhoneNumber(phoneNumber);

  // res.status(200).json(data);
  res.status(200).json({ phoneNumber }); // remove this line
}
