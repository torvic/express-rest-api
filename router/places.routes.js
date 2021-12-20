import { Router } from 'express'

const router = Router()

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

// localhost:6000/places/1234556
router.get('/:placeId', (req, res, next) => {
  const { placeId } = req.params

  // find the place id, in the DUMMY places
  const place = DUMMY_PLACES.find((place) => {
    return place.id === placeId
  })
  // place is equal to undefined
  if (!place) {
    const error = new Error('Could not find a place for the provided id.')
    error.code = 404
    throw error
  }

  res.json({ place })
})

// retrieve user ->  userId
router.get('/user/:userId', (req, res, next) => {
  const { userId } = req.params

  const place = DUMMY_PLACES.find((place) => {
    return place.creator === userId
  })

  if (!place) {
    const error = new Error('Could not find a place for the provided user id.')
    error.code = 404
    throw next(error)
  }

  res.json({ place })
})

export default router
