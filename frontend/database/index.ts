import mongoose, { Mongoose } from 'mongoose';
import Subscriber, { ISubscriber } from './models/Subscriber';
import Event, { IEvent } from './models/Event';

class Database {
  private connectionURI: string;
  private connection: Mongoose | undefined;

  constructor() {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    this.connectionURI = MONGODB_URI;
  }

  private async connect(): Promise<Mongoose> {
    if (this.connection) return this.connection;

    console.log('Connecting to database...');
    const connection = await mongoose.connect(this.connectionURI);
    this.connection = connection;
    return connection;
  }

  public async fetchUser(id: number): Promise<ISubscriber | null> {
    await this.connect();

    const user = (await Subscriber.findOne({ 'ow.id': id }).populate<{
      ow: 'OWData';
    }>('ow')) as ISubscriber | null;

    if (user === null || typeof user.ow === 'string') return null;

    return user;
  }

  public async fetchEvents(): Promise<IEvent[]> {
    await this.connect();

    const currentTime = new Date();

    const events = await Event.find({
      start_date: { $gte: currentTime.toISOString() },
    }).sort({
      start_date: 1,
    });

    return events;
  }
}

const database = new Database();

export default database;
