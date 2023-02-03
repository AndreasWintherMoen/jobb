// This file is very temporary and will be replaced with a more robust solution
// I wanted to make a quick and dirty solution to get the app working for bedcrawl

import { NextApiRequest, NextApiResponse } from 'next';
import Twilio from 'twilio';

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

  const paddedPhoneNumber = `+47${phoneNumber}`;

  const response = await twilio.messages
    .create({
      to: paddedPhoneNumber,
      from: sender,
      // This is obviously a temporary solution.
      // TODO: Implement verification code generation and checking, probably using crypto module
      body: '98172 is your pass code for Bedpres Bot',
    })
    .then((message: any) => message.sid);

  return res.status(200).json({ response });
}
