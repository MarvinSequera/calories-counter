import express from 'express'
import { verifyToken } from '../middleware/auth.js'
const routerIndex = express.Router()


routerIndex.get('/api', verifyToken ,(req, res) => res.json({ message: 'Holis'}))

export { routerIndex }