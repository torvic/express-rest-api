import { v4 as uuidv4 } from 'uuid'
import HttpError from '../models/http-error.model.js'

const DUMMY_PLACES = [
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
]

const getPlaceById = (req, res, next) => {
  const { placeId } = req.params

  const place = DUMMY_PLACES.find((place) => {
    return place.id === placeId
  })

  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404)
  }
  res.json({ place })
}

const getPlaceByUserId = (req, res, next) => {
	const { userId } = req.params;

  const places = DUMMY_PLACES.filter((place) => {
    return place.creator === userId;
  });

  if (!places || !places.length) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }

  res.json({ places });
}

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body
  // const title = req.body.title;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  }

  DUMMY_PLACES.push(createdPlace) // unshift(createdPlace)

  res.status(201).json({ place: createdPlace })
}

const updatePlace = (req, res, next) => {
  const { title, description } = req.body
  const { placeId } = req.params

  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId)

  const updatedPlace = { ...DUMMY_PLACES[placeIndex] }

  if (!updatedPlace) {
    return next(new HttpError('There is not a place with this id.'))
  }

  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({ place: updatedPlace })
}

const deletePlace = (req, res, next) => {
  const { placeId } = req.params
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId)
  res.status(200).json({ message: 'Deleted place.' })
}

export { getPlaceById, getPlaceByUserId, createPlace, updatePlace, deletePlace }
