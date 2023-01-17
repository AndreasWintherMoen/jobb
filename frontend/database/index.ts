import mongoose, { Mongoose } from 'mongoose';
import Subscriber from './models/Subscriber';

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

  private async connect() {
    if (this.connection) return this.connection;

    console.log('Connecting to database...');
    const connection = await mongoose.connect(this.connectionURI);
    this.connection = connection;
    return connection;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async fetchUser(id: number) {
    await this.connect();

    const user = await Subscriber.findOne({ 'ow.id': id });
    await this.delay(5000);

    return user;
  }
}

const database = new Database();

export default database;
