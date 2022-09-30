const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: 'This field is required.'
    },
    author:{
        type: String,
        required: 'This field is required.'
    },
    category:{
        type: String,
        enum: ['Hatchback', 'Electric', 'Sedan', 'Compact Suv', 'Suv', 'Muv', 'Pickup', 'Luxury', 'Offroad', 'Convertable', 'Sports'],
        required: 'This field is required.'
    },
    article:{
        type: String,
        required: 'This field is required.'
    },
    image:{
        type: String,
        required: 'This field is required.'
    }
    
});

blogSchema.index({title: 'text', article: 'text'});
// blogSchema.index({ "$**" : 'text'});

module.exports = mongoose.model('Blog', blogSchema);