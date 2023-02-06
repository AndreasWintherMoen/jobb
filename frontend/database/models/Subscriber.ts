import mongoose from 'mongoose';
import { IOWData, OWDataSchema } from './OWData';

const SubscriberSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.String, unique: true, required: true },
  phone_number: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  ow: { type: OWDataSchema, ref: 'OWData', required: true },
  should_receive_ads: { type: mongoose.Schema.Types.Boolean, required: true },
  ads_received: { type: [mongoose.Schema.Types.String], required: true },
});

export interface ISubscriber {
  _id: string;
  phone_number: string;
  ow: IOWData;
  should_receive_ads: boolean;
  ads_received: string[];
}

export default mongoose.model('Subscriber', SubscriberSchema);
