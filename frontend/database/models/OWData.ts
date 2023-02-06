import mongoose, { mongo } from 'mongoose';

export const OWDataSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
    index: true,
  },
  id: { type: mongoose.Schema.Types.Number, unique: true, required: true },
  username: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  nickname: mongoose.Schema.Types.String,
  first_name: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  last_name: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  phone_number: mongoose.Schema.Types.String,
  online_mail: mongoose.Schema.Types.String,
  address: mongoose.Schema.Types.String,
  zip_code: mongoose.Schema.Types.String,
  email: mongoose.Schema.Types.String,
  website: mongoose.Schema.Types.String,
  github: mongoose.Schema.Types.String,
  linkedin: mongoose.Schema.Types.String,
  ntnu_username: mongoose.Schema.Types.String,
  field_of_study: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  year: { type: mongoose.Schema.Types.String, unique: true, required: true },
  bio: { type: mongoose.Schema.Types.String, unique: true, required: true },
  positions: mongoose.Schema.Types.Array,
  special_positions: mongoose.Schema.Types.Array,
  image: { type: mongoose.Schema.Types.String, unique: true, required: true },
  started_date: { type: mongoose.Schema.Types.String, required: true },
});

export interface IOWData {
  _id: string;
  id: number;
  username: string;
  nickname?: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  online_mail?: string;
  address?: string;
  zip_code?: string;
  email?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  ntnu_username?: string;
  field_of_study: string;
  year: string;
  bio: string;
  positions?: string[];
  special_positions?: string[];
  image: string;
  started_date: string;
}

export default mongoose.model('OWData', OWDataSchema);
