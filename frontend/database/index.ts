import mongoose, { Mongoose } from 'mongoose';
import Subscriber from './models/Subscriber';

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
      // we're already connecting, so wait for that to finish instead of starting a new connection
      return this.connectingAttempt;
    }

    console.log('Connecting to database...');
    this.connectingAttempt = mongoose.connect(this.connectionURI);
    const connection = await this.connectingAttempt;
    this.connection = connection;
    this.connectingAttempt = undefined;
    return connection;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async fetchUser(id: number) {
    await this.connect();

    const user = await Subscriber.findOne({ 'ow.id': id });
    // await this.delay(5000);

    return user;
  }
}

const database = new Database();

export default database;
