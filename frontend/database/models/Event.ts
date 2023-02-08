import mongoose from 'mongoose';
import { EventIndex } from '../../utils/events/types';

const EventSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  id: { type: mongoose.Schema.Types.Number, unique: true, required: true },
  title: { type: mongoose.Schema.Types.String, required: true },
  slug: { type: mongoose.Schema.Types.String, required: true },
  ingress: { type: mongoose.Schema.Types.String, required: true },
  ingress_short: { type: mongoose.Schema.Types.String, required: true },
  description: { type: mongoose.Schema.Types.String, required: true },
  start_date: { type: mongoose.Schema.Types.String, required: true },
  end_date: { type: mongoose.Schema.Types.String, required: true },
  location: { type: mongoose.Schema.Types.String, required: true },
  event_type: { type: mongoose.Schema.Types.Number, required: true },
  event_type_display: { type: mongoose.Schema.Types.String, required: true },
  organizer: mongoose.Schema.Types.Number,
  images: [mongoose.Schema.Types.String],
  companies: [mongoose.Schema.Types.String],
  is_attendance_event: { type: mongoose.Schema.Types.Boolean, required: true },
  max_capacity: { type: mongoose.Schema.Types.Number, required: true },
  number_of_seats_taken: { type: mongoose.Schema.Types.Number, required: true },
  registration_start: { type: mongoose.Schema.Types.String, required: true },
  registration_end: { type: mongoose.Schema.Types.String, required: true },
  unattend_deadline: { type: mongoose.Schema.Types.String, required: true },
});

export interface IEvent {
  _id?: mongoose.Types.ObjectId;
  id: number;
  title: string;
  slug: string;
  ingress: string;
  ingress_short: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  event_type: EventIndex;
  event_type_display: string;
  organizer?: number;
  images?: string[];
  companies?: string[];
  is_attendance_event: boolean;
  max_capacity: number;
  number_of_seats_taken: number;
  registration_start: string;
  registration_end: string;
  unattend_deadline: string;
}

export default mongoose.model('Event', EventSchema);
