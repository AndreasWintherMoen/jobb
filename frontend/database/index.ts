import mongoose, { Mongoose } from 'mongoose';
import Subscriber, { ISubscriber } from './models/Subscriber';
import Event, { IEvent } from './models/Event';
import Exclusion, { IExclusion } from './models/Exclusion';

class Database {
  private connectionURI: string;
  private connection: Mongoose | undefined;
  private connectingAttempt: Promise<Mongoose> | undefined;

  constructor() {
    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    this.connectionURI = MONGODB_URI;
  }

  private async connect(): Promise<Mongoose> {
    if (this.connection) return this.connection;
    if (this.connectingAttempt) {
      // we're already connecting, so wait for that to finish instea of starting a new connection
      return this.connectingAttempt;
    }

    this.connectingAttempt = mongoose.connect(this.connectionURI);
    const connection = await this.connectingAttempt;
    this.connection = connection;
    this.connectingAttempt = undefined;
    return connection;
  }

  public async fetchUser(id: number): Promise<ISubscriber | null> {
    await this.connect();

    const user = (await Subscriber.findOne({
      'ow.id': id,
    })
      .select('-id')
      .lean()) as ISubscriber | null;

    if (user === null || typeof user.ow === 'string') return null;

    return user;
  }

  public async fetchEvents(): Promise<IEvent[]> {
    await this.connect();

    const currentTime = new Date();

    const events = (await Event.find({
      start_date: { $gte: currentTime.toISOString() },
    })
      .sort({
        start_date: 1,
      })
      .select('-_id')
      .lean()) as IEvent[];

    return events;
  }

  public async fetchUpcomingRegistrations(): Promise<IEvent[]> {
    await this.connect();

    const currentTime = new Date();

    const events = (await Event.find({
      registration_start: { $gte: currentTime.toISOString() },
    })
      .sort({
        registration_start: 1,
      })
      .select('-_id')
      .lean()) as IEvent[];

    return events;
  }

  public async fetchExclusions(userId: number): Promise<IExclusion[]> {
    await this.connect();

    const exclusions = (await Exclusion.find({
      subscriber_id: userId,
    })
      .select('-_id')
      .lean()) as IExclusion[];

    return exclusions;
  }

  public async insertExclusion(exclusion: IExclusion) {
    await this.connect();

    // await Exclusion.create(exclusion);
    const exclusionDoc = new Exclusion(exclusion);
    await exclusionDoc.save();
  }

  public async removeExclusion(exclusion: IExclusion) {
    await this.connect();

    await Exclusion.deleteMany(exclusion);
  }
}

const database = new Database();

export default database;
