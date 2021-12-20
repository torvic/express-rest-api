import express from 'express'
import placesRouter from './router/places.routes.js'
// Utils
import HttpError from './models/http-error.model.js';


// initialize express
const app = express()
const PORT = process.env.PORT || 5000

// middlewares
app.use(express.json())
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.messages || 'An unknown error occurred!' })
})
app.use((req, res, next) => {
  const error = new HttpError('Could not find this routes.', 404);
  throw error;
});

// routes
app.use('/api/places', placesRouter)

app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`))
