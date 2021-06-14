const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
        default: '#000000'
    },
    icon: {
        type: String,
        required: true,
        default: 'mode_edit'
    },
    parent_id: {
        type: String,
        default: ''
    }
})

CategorySchema.statics.findByUser = async (id) => {
    // Search for a categories by user id.
    const categories = await Category.find({user_id: id})
    if (!categories) {
        throw new Error('Invalid user id')
    }
    return categories
}

const Category = mongoose.model('Category', CategorySchema)
module.exports = Category