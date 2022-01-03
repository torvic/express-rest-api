import { getCoordsForAddress } from '../utils/location.js';
import { validationResult } from 'express-validator';
// import { v4 as uuidv4 } from 'uuid';
import HttpError from '../models/http-error.model.js';
// Models
import Place from '../models/Place.schema.js';
import User from '../models/User.schema.js';
import mongoose from 'mongoose';

/* const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
]; */

/**
 * Get place by ID
 * @param {Object} req
 * @param {Object} res
 */
const getPlaceById = async (req, res, next) => {
  const { placeId } = req.params;

  /* const place = DUMMY_PLACES.find((place) => {
    return place.id === placeId
  }) */
  let place;
  try {
    place = await Place.findById(placeId);
    // place = await Place.findById(placeId).select('-__v');
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not find a place.', 500),
    );
  }

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }
  res.json({ place });
};

/**
 * Get place by user ID
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
const getPlaceByUserId = async (req, res, next) => {
  const { userId } = req.params;

  /* const places = DUMMY_PLACES.filter((place) => {
    return place.creator === userId
  }) */
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId, '-__v').populate('places');
  } catch (error) {
    return next(
      new HttpError('Fetching places failed, please try again later.', 500),
    );
  }
  console.log(userWithPlaces);

  if (!userWithPlaces || !userWithPlaces.places.length) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404),
    );
  }

  res.json({ places: userWithPlaces.places });
};

/**
 * Create a place
 * @param {Object} req
 * @param {Object} res
 */
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, address, creator } = req.body;
  // const title = req.body.title;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  /* **************** without mongoose **************** */
  /* const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  }

  DUMMY_PLACES.push(createdPlace) // unshift(createdPlace) */

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image: 'imageUrl',
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError('Creating place failed, please try again', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id', 404));
  }

  try {
    // Mongoose Transaction
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await createdPlace.save({ session });
      await user.places.push(createdPlace);
      await user.save({ session });
    });
    await session.endSession();
  } catch (err) {
    return next(HttpError('Creating place failed, please try again.', 500));
  }

  try {
    await createdPlace.save();
  } catch (error) {
    return next(HttpError('Creating place failed, please try again.', 500));
  }

  res.status(201).json({ place: createdPlace });
};

/**
 * Update a place
 * @param {Object} req
 * @param {Object} res
 */
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(errors);
    // return res.status(400).json({ errors: errors.array() });
  }
  const { title, description } = req.body;
  const { placeId } = req.params;

  /* const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId)

  const updatedPlace = { ...DUMMY_PLACES[placeIndex] } */

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500),
    );
  }

  if (!place) {
    return next(new HttpError('There is not a place with this id.'));
  }

  place.title = title;
  place.description = description;

  /* DUMMY_PLACES[placeIndex] = updatedPlace */

  try {
    await place.save();
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500),
    );
  }

  /* try {
    // place = await Place.updateOne({ _id: placeId }, { title, description });
    place = await Place.findOneAndUpdate(
      { _id: placeId },
      { title, description }
    );
    place = await Place.findOneAndUpdate(
      { _id: placeId },
      { title, description },
      { new: true }
    );
    place = await Place.findByIdAndUpdate(
      placeId,
      { title, description },
      { new: true }
    );
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500)
    );
  } */

  res.status(200).json({ place });
};

/**
 * Delete a place
 * @param {Object} req
 * @param {Object} res
 */
const deletePlace = async (req, res, next) => {
  const { placeId } = req.params;

  /* if (!DUMMY_PLACES.find((place) => place.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404)
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId) */
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const place = await Place.findByIdAndDelete(placeId, {
        session,
      }).populate('creator');
      place.creator.places.pull(place);
      await place.creator.save({ session });
    });
  } catch (error) {
    return next(
      new HttpError('Something went wrong, could not delete place.', 500),
    );
  }

  res.status(200).json({ message: 'Deleted place.' });
};

export {
  getPlaceById,
  getPlaceByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
