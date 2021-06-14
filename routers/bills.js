const express = require('express')
const Bill = require('../models/Bill')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    // Create a new bill
    try {
        const bill = new Bill({
            ...req.body,
            user_id: req.user.id
        })
        if (bill.type === 'storing') {
            await bill.addGoal('Загальний', 0);
        } else {
            await bill.save()
        }
        res.status(200).send(bill)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/user', auth, async (req, res) => {
    // View all bills of the user
    try {
        const bills = await Bill.findByUser(req.user.id)
        if (!bills) {
            return res.status(404).send({error: 'Cant found bills for this user'})
        }
        res.send(bills)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

// todo transfer money from one bill to another
// todo add money to the bill

module.exports = router