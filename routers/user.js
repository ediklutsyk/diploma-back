const express = require('express')
const User = require('../models/User')
const Category = require('../models/Category')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', async (req, res) => {
    // Create a new user
    try {
        console.log(req.body)
        const user = new User(req.body)
        await user.save()
        // init entities for the new user
        const categories = [
            {name: 'Продукти', user_id: user._id, color: 'blue', icon: 'groceries.svg'},
            {name: 'Кафе', user_id: user._id, color: 'dark_blue', icon: 'fork-and-knife.svg'},
            {name: 'Доставка їжі', user_id: user._id, color: 'green', icon: 'fork-and-knife.svg'},
            {name: 'Транспорт', user_id: user._id, color: 'orange', icon: 'front-of-bus.svg'},
            {name: 'Житло', user_id: user._id, color: 'violet', icon: 'home.svg'},
            {name: 'Покупки', user_id: user._id, color: 'teal', icon: 'back.svg'}
        ]
        await categories.forEach(item => {
            const category = new Category(item)
            category.save();
        })
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async (req, res) => {
    //Login a registered user
    try {
        const {email, password} = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/profile', auth, async (req, res) => {
    // View logged in user profile
    res.send(req.user)
})

router.post('/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/logoutall', auth, async (req, res) => {
    // Log user out of all devices
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router