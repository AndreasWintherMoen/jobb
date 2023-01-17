import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  key: mongoose.Schema.Types.String,
  text: mongoose.Schema.Types.String,
  is_active: mongoose.Schema.Types.Boolean,
  priority_order: mongoose.Schema.Types.Number,
});

export default mongoose.model('Ad', AdSchema);
