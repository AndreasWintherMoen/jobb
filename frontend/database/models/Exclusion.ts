import mongoose from 'mongoose';

const ExclusionSchema = new mongoose.Schema({
  subscriber_id: { type: mongoose.Schema.Types.Number, required: true },
  event_id: { type: mongoose.Schema.Types.Number, required: true },
});

export interface IExclusion {
  _id?: mongoose.Types.ObjectId;
  subscriber_id: number;
  event_id: number;
}

export default mongoose.model('Exclusion', ExclusionSchema);
