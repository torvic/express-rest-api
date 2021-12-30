import mongoose, { Types } from 'mongoose';
const { Schema, model } = mongoose;

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: [
    {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
});

export default model('Place', placeSchema);
