import express from 'express'
const routerAuth = express.Router()

routerAuth.post('/singup', (req, res) => {
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
        }
    })

    console.log(req.body)
    res.json({test: 'complete'})
})

export { routerAuth }