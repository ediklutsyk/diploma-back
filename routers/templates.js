const express = require('express')
const Template = require('../models/Template')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/', auth, async (req, res) => {
    // Create a new template
    try {
        const template = new Template({
            ...req.body,
            user_id: req.user.id
        })
        await template.save()
        res.status(200).send(template)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/user', auth, async (req, res) => {
    // View all bills of the user
    try {
        const user = req.user.id
        let templates = await Template.findByUser(user);
        if (!templates) {
            return res.status(404).send({error: 'Cant found templates for this user'})
        }
        res.send(templates)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

// todo transfer money from one bill to another
// todo add money to the bill

module.exports = router