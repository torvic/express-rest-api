import express from 'express'
import placesRouter from './router/places.routes'

// initialize express
const app = express()
const PORT = process.env.PORT || 5000

// middlewares

// routes
app.user('/api/places', placesRouter)



app.listen(PORT, console.log(`Server is running on PORT: ${PORT}`))




