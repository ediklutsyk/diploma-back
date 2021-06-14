const mongoose = require('mongoose')

const TemplateSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    bill_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    }
})

TemplateSchema.statics.findByUser = async (id) => {
    // Search for a templates by user id.
    const templates = await Template.find({user_id: id})
    if (!templates) {
        throw new Error('Invalid user id')
    }
    return templates
}

const Template = mongoose.model('Template', TemplateSchema)
module.exports = Template