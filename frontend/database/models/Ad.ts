import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
    index: true,
  },
  key: { type: mongoose.Schema.Types.String, unique: true, required: true },
  text: { type: mongoose.Schema.Types.String, required: true },
  is_active: { type: mongoose.Schema.Types.Boolean, required: true },
  priority_order: { type: mongoose.Schema.Types.Number, required: true },
});

export interface IAd {
  _id?: string;
  key: string;
  text: string;
  is_active: boolean;
  priority_order: number;
}

export default mongoose.model('Ad', AdSchema);
