import { NextApiRequest, NextApiResponse } from 'next';
import auth from '../../../auth';
import database from '../../../database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('notification/toggle');
  console.log(req.method);
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId } = req.query;
  if (!eventId || typeof eventId !== 'string' || isNaN(Number(eventId))) {
    return res.status(400).json({ error: 'Bad request' });
  }

  const sendNotification = req.method === 'POST';

  try {
    // TODO: Implement this
    // const user = await auth.fetchUser();

    const user = {
      id: 1421,
    };

    const exclusion = {
      subscriber_id: user.id,
      event_id: parseInt(eventId),
    };
    if (sendNotification) {
      await database.insertExclusion(exclusion);
    } else {
      await database.removeExclusion(exclusion);
    }
    res.status(200).json({ status: 'OK' });
  } catch (err) {
    console.log('error ');
    console.log(err);
    const error = 'Something went wrong';
    res.status(500).json({ error });
  }
}
