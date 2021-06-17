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
            {name: 'Продукти', user_id: user._id, color: '#2B87E3', icon: 'groceries.svg'},
            {name: 'Кафе', user_id: user._id, color: '#0F56B3', icon: 'fork-and-knife.svg'},
            {name: 'Доставка їжі', user_id: user._id, color: '#2AB930', icon: 'fork-and-knife.svg'},
            {name: 'Транспорт', user_id: user._id, color: '#ED9526', icon: 'front-of-bus.svg'},
            {name: 'Житло', user_id: user._id, color: '#730C8F', icon: 'home.svg'},
            {name: 'Інше', user_id: user._id, color: '#72778D', icon: 'more.svg'}
        ]
        const bills = [
            {name: 'Основна картка', user_id: user._id, color: '#2B87E3', balance: 0, type: 'card', icon: 'card.svg'},
            {name: 'Готівка', user_id: user._id, color: '#2AB930', balance: 0, type: 'cash', icon: 'wallet.svg'},
            {
                name: 'Банківський рахунок',
                user_id: user._id,
                color: '#BF710F',
                balance: 0,
                type: 'storing',
                icon: 'bank.svg',
                currency: 'USD'
            },
        ]
        await categories.forEach(item => {
            const category = new Category(item)
            category.save();
        })
        await bills.forEach(item => {
            const bill = new Bill(item)
            bill.save();
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