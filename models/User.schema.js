// import mongoose from 'mongoose';
// const { Schema, model } = mongoose;
import { Schema, model, plugin } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: { type: String, required: true },
});

plugin(uniqueValidator);

export default model('User', userSchema);
