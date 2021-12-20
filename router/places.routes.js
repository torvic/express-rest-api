import { Router } from 'express'

// Controllers
import {
  getPlaceById,
  getPlaceByUserId,
} from '../controllers/places.controller.js'

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
router.get('/:placeId', getPlaceById)

// retrieve user ->  userId
router.get('/user/:userId', getPlaceByUserId)

export default router
