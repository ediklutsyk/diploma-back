const express = require('express')
const Operation = require('../models/Operation')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    // Create a new bill
    try {
        const operation = new Operation({
            ...req.body,
            user_id: req.user.id
        })
        await operation.save()
        res.status(200).send(operation)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/current', auth, async (req, res) => {
    // View all bills of the user
    try {
        const operations = await Operation.findByCurrentMonth(req.user.id)
        if (!operations) {
            return res.status(404).send({error: 'Cant found operations for this user this month'})
        }
        res.send(operations)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/categories/total', auth, async (req, res) => {
    // View all bills of the user
    try {
        const operations = await Operation.getTotalByCategories(req.user.id)
        if (!operations) {
            return res.status(404).send({error: 'Cant found operations for this user this month'})
        }
        res.send(operations)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

router.get('/total', auth, async (req, res) => {
    // View all bills of the user
    try {
        const month = parseInt(req.query.month)
        const year = parseInt(req.query.year)
        const operations = await Operation.getTotalForMonth(req.user.id, month, year)
        if (!operations) {
            return res.status(404).send({error: 'Cant found operations for this user this month'})
        }
        res.send(operations)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

// todo transfer money from one bill to another
// todo add money to the bill

module.exports = router