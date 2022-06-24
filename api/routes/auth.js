import express from 'express'
import bcrypt from 'bcrypt'
import jwt  from 'jsonwebtoken'
import { db } from '../app.js'
const routerAuth = express.Router()
const saltRounds = process.env.SALT
const jwtToken = process.env.JWT_TOKEN

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
    // TODO: Apply fix for error handle
    try {
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

        const token = jwt.sign(
            { insertedId },
            jwtToken,
            { expiresIn: '48h' }
        )
        
        res.status(200).json({ 
            Message: 'Success User Created',
            userId : insertedId,
            token
        })
    } catch {
        res.status(500).json({
            errorMessage: 'Upps Something went wrong'
        })
    }
})

routerAuth.post('/signin', async (req, res) => {
    const { body: { password, email } } = req
    const userCollection = db.collection('users')

    try {

        const user = await userCollection.findOne({ email })
        
        if (!user) {
        res.status(403).send('Password or Email not valid')
        return
        }
        
        const { password: passwordStore, _id: userId, active } = user
        
        const passwordMatch = await bcrypt.compare(password, passwordStore)
        
        if (!passwordMatch || !active) {
            res.status(403).send('Password or Email not valid')
            return
        }
        
        const token = jwt.sign(
            { userId },
            jwtToken,
            { expiresIn: '48h' }
        )

        
        res.status(201).json({ userId, token })
    } catch {
        res.status(500).json({
            errorMessage: 'Upps Something went wrong'
        })
    }
})

export { routerAuth }