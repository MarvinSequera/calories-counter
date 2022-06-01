import express from 'express'
const routerIndex = express.Router()


routerIndex.get('/api', (req, res) => res.json({ message: 'Holis'}))

export { routerIndex }