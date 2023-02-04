import { NextApiRequest, NextApiResponse } from 'next';
import Twilio from 'twilio';
import { generateEncryptedOtp } from '../../../../utils/otp';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

var twilio = new (Twilio as any)(accountSid, authToken);

const sender = 'Bedpres Bot';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  if (!accountSid || !authToken) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  if (phoneNumber !== process.env.DEV_PHONE_NUMBER) {
    return res.status(401).json({
      error:
        "This feature is in development. To prevent expensive SMS costs, I've only enabled it for my phone number",
    });
  }

  if (phoneNumber.length !== 8) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const paddedPhoneNumber = phoneNumber.includes('+')
    ? phoneNumber
    : `+47${phoneNumber}`;

  const { cipher, code } = await generateEncryptedOtp(phoneNumber);

  await twilio.messages.create({
    to: paddedPhoneNumber,
    from: sender,
    body: `${code} er din kode for Bedpres Bot`,
  });

  return res.status(200).json({ cipher });
}
