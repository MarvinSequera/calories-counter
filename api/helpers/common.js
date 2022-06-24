import jwt from 'jsonwebtoken'
const jwtToken = process.env.JWT_TOKEN
import { ObjectId } from 'mongodb'

const getUserId = (req) => {
    const token = req.headers['x-calories-counter-token']
    const decoded = jwt.decode(token, jwtToken)
    const { userId } = decoded
    return userId
}


export { getUserId, ObjectId }