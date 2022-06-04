import express from 'express'
import bcrypt from 'bcrypt'
import { db } from '../app.js'
const routerAuth = express.Router()
const saltRounds = process.env.SALT

const test = '$2b$10$tqhZajQg9Reda1QgVopoX.J8d8JYWFMjAaVfNlA4YcTjITTKub5i6'

routerAuth.post('/singup', async (req, res) => {
    const { 
        name,
        email,
        password,
        height,
        weight,
        age,
        waist,
        fat,
    } = req.body
    const expectedValues = ['name','email','password','height','weight','age','waist','fat',]

    expectedValues.map(key => {
        if (!req.body[key]) {
            res.status(400).send(`Data incomplete missing ${key}`)
            return
        }
    })

    const userCollection = db.collection('users')

    const userExist = await userCollection.findOne({ email })

    if (userExist) {
        res.status(400).send(`Email Exist`)
        return
    }

    const salt = await bcrypt.genSalt(+saltRounds)
    const hash = await bcrypt.hash(password, salt)
    const newUser = await userCollection.insertOne({
        name,
        email,
        password: hash,
        height,
        weight,
        age,
        waist,
        fat,
        active: true,
        diating: false,
    })

    if (!newUser) {
        res.status(500).send('Error Saving New User')
        return
    }

    const { insertedId } = newUser

    res.json({ 
        Message: 'Success User Created',
        Id: insertedId
    })
})

// TODO: login
    // bcrypt.compare(password, test, (err, res) => {
    //     if (err) {
    //         console.error(err);
    //     }


export { routerAuth }