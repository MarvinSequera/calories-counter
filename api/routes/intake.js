import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { db } from '../app.js'
import { getUserId, ObjectId } from '../helpers/common.js'
const routerIntake = express.Router()

routerIntake.get('/intake', verifyToken, async (req, res) => {
    // TODO: Apply date range
    const userId = ObjectId(getUserId(req))
    
    try {
        const intakeCollection = db.collection('intake')
        const intakes = await intakeCollection.find({ userId }).toArray()
        res.status(200).json({ intakes })
    } catch {
        res.status(500).send("Upps Something When Wrong")
    }
})

routerIntake.post('/intake', verifyToken, async (req, res) => {
    const userId = ObjectId(getUserId(req))

    try {
        const intakeCollection = db.collection('intake')
        
        const { 
            foodId,
            weight
        } = req.body

        const newIntake = await intakeCollection.insertOne({
            userId,
            foodId: ObjectId(foodId),
            weight,
            createdAt: new Date()
        })

        console.log(newIntake)

        const { insertedId } = newIntake

        res.status(200).send({ insertedId, message: "Intake Added" })
    } catch {
        res.status(500).send("Upps Something When Wrong")
    }

})

export default routerIntake