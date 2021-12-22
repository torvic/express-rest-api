import express from 'express'
import placesRouter from './router/places.routes.js'
import usersRouter from './router/users.routes.js'
import mongoose from 'mongoose'
import 'colors'
// Utils
import HttpError from './models/http-error.model.js'

// connection to mongoDB
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/places_app'

mongoose
  .connect(MONGO_URI)
  .then((connection) =>
    console.log(
      `MongoDb Connected: ${connection.connection.host}`.cyan.underline.bold
    )
  )
  .catch((error) => console.log(`MongoDB connection error: ${error}`.red.bold))

// initialize express
const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json())
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }
  if (error instanceof Result) {
    return res.status(400).json({ errors: error.array() })
  }
  res.status(error.code || 500)
  res.json({ message: error.messages || 'An unknown error occurred!' })
})

// routes
app.use('/api/places', placesRouter)
app.use('/api/users', usersRouter)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this routes.', 404)
  throw error
})
app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`))
