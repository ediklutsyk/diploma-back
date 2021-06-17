const express = require('express')
const Template = require('../models/Template')
const Category = require('../models/Category')
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
    // View all templates of the user
    try {
        const user = req.user.id
        let categories = await Category.findByUser(req.user.id)
        if (!categories) {
            return res.status(404).send({error: 'Cant found categories for this user'})
        }
        let templates = await Template.findByUser(user);
        if (!templates) {
            return res.status(404).send({error: 'Cant found templates for this user'})
        }
        templates = templates.map(template => {
            let category = categories.find(category => {
                return category._id.toString() === template.category_id.toString()
            })
            return {
                ...template._doc,
                categoryColor: category.color,
                categoryIcon: category.icon,
            }
        });
        res.send(templates)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

module.exports = router