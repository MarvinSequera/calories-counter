import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { db } from '../app.js'
import { getUserId, ObjectId } from '../helpers/common.js'
const routerFoods = express.Router()
const expectedValues = ['name', 'carb', 'protein', 'fat']

routerFoods.get('/foods', verifyToken, async (req, res) => {
    const userId = getUserId(req)
    const foodCollection = db.collection('food')

    try {
        const foods = await foodCollection.find({ userId }).toArray()
        res.status(200).json({ foods })
    } catch {
        res.status(500).send("Upps Something When Wrong")
    }
})

routerFoods.get('/foods/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    
    try {
        const foodCollection = db.collection('food')
        const food = await foodCollection.findOne({ _id: ObjectId(id) })
        res.status(200).json({ food })
    } catch {
        res.status(400).send("Food Not Found")
    }
    
})

routerFoods.post('/foods', verifyToken, async (req, res) => {
    const userId = getUserId(req)
    const { 
        name,
        carb,
        protein,
        fat
    } = req.body
    
    let errorMessage = "Upps Something When Wrong"
    try {
        expectedValues.map(key => {
            if (!req.body[key]) {
                errorMessage = `Data incomplete missing ${key}`
                throw new Error()
            }
        })
        const foodCollection = db.collection('food')
        const oldFood = await foodCollection.findOne({ name, userId })

        if (oldFood) {
            errorMessage = 'Food Exist'
            throw new Error()
        }
        
        const newFood = await foodCollection.insertOne({
            name,
            carb,
            protein,
            fat,
            userId
        })

        const { insertedId } = newFood

        res.status(200).send({ insertedId, message: "Food Created" })
    } catch {
        res.status(500).send(errorMessage)
    }  
})

routerFoods.post('/foods/:id', verifyToken, async (req, res) => {
    const userId = getUserId(req)
    const { id } = req.params
    const { 
        name,
        carb,
        protein,
        fat
    } = req.body
    let errorMessage = "Upps Something When Wrong"

    try {
        expectedValues.map(key => {
            if (!req.body[key]) {
                errorMessage = `Data incomplete missing ${key}`
                throw new Error()
            }
        })

        const foodCollection = db.collection('food')
        
        await foodCollection.findOne({ _id: ObjectId(id), userId })

        await foodCollection.updateOne(
            { _id: ObjectId(id), userId },
            { $set: { 
                name, 
                carb, 
                protein, 
                fat
            }}
        )
        res.status(200).send({message: 'Food Updated'})
    } catch {
        res.status(500).send(errorMessage)
    }
})

export { routerFoods }
