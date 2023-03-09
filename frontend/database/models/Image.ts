import mongoose from 'mongoose';

export const ImageSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Number, unique: true, required: true },
  description: { type: mongoose.Schema.Types.String },
  lg: { type: mongoose.Schema.Types.String },
  md: { type: mongoose.Schema.Types.String },
  sm: { type: mongoose.Schema.Types.String },
  xs: { type: mongoose.Schema.Types.String },
  original: { type: mongoose.Schema.Types.String },
  name: { type: mongoose.Schema.Types.String },
  photographer: { type: mongoose.Schema.Types.String },
  preset: { type: mongoose.Schema.Types.String },
  preset_display: { type: mongoose.Schema.Types.String },
  tags: { type: [mongoose.Schema.Types.String] },
  thumb: { type: mongoose.Schema.Types.String },
  timestamp: { type: mongoose.Schema.Types.String },
  wide: { type: mongoose.Schema.Types.String },
});

export interface IImage {
  id: number;
  description?: string;
  lg?: string;
  md?: string;
  sm?: string;
  xs?: string;
  original?: string;
  name?: string;
  photographer?: string;
  preset?: string;
  preset_display?: string;
  tags?: string[];
  thumb?: string;
  timestamp?: string;
  wide?: string;
}
