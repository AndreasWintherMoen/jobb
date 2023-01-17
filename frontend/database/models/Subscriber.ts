import mongoose from 'mongoose';
import OWData from './OWData';

const SubscriberSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  phone_number: mongoose.Schema.Types.String,
  ow: {
    _id: mongoose.Schema.Types.ObjectId,
    id: mongoose.Schema.Types.Number,
    username: mongoose.Schema.Types.String,
    nickname: mongoose.Schema.Types.String,
    first_name: mongoose.Schema.Types.String,
    last_name: mongoose.Schema.Types.String,
    phone_number: mongoose.Schema.Types.String,
    online_mail: mongoose.Schema.Types.String,
    address: mongoose.Schema.Types.String,
    zip_code: mongoose.Schema.Types.String,
    email: mongoose.Schema.Types.String,
    website: mongoose.Schema.Types.String,
    github: mongoose.Schema.Types.String,
    linkedin: mongoose.Schema.Types.String,
    ntnu_username: mongoose.Schema.Types.String,
    field_of_study: mongoose.Schema.Types.Number,
    year: mongoose.Schema.Types.Number,
    bio: mongoose.Schema.Types.String,
    positions: mongoose.Schema.Types.Array,
    special_positions: mongoose.Schema.Types.Array,
    image: mongoose.Schema.Types.String,
    started_date: mongoose.Schema.Types.String,
  },
  should_receive_ads: mongoose.Schema.Types.Boolean,
  ads_received: mongoose.Schema.Types.Array,
});

export default mongoose.model('Subscriber', SubscriberSchema);
