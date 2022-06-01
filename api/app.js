import express from 'express'
import 'dotenv/config'
import { routerIndex } from './routes/index.js'
import { MongoClient } from 'mongodb'
const app = express()
const port = process.env.PORT
const mongoUrl = 'mongodb://127.0.0.1:27017'

// MongoDB
MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err, client) => {
    if (err) {
        return console.error(err)
    }

    const db = client.db('calories_counter')
    console.log(`MongoDB Connected: ${mongoUrl}`)
})

// Routes
app.use(routerIndex)

app.listen(port, () => console.log(`Listening on Port ${port}`))