const mongoose = require('mongoose');

const {Schema} = mongoose;

// create Schema
const recipeSchema = new Schema({
    slug: String,
    name: {
        type: String
    },
    yield: String,
    course: {
        type: String,
        enum: ['Appetizers', 'Breads', 'Drinks', 'Mains', 'Rubs', 'Salads', 'Sauces', 'Sides', 'Soups & Stews']
    },
    prepTime: Number,
    cookTime: Number, // On breads, represent this visually as bake time
    marinateTime: Number,
    totalRiseTime: Number,
    activeTime: Number, // Virtualize total time
    from: String, // Recipe source: could be URL or book, etc
    attribution: String, // author of recipe
    ingredients: [
        {type: Schema.Types.ObjectId, ref: 'Ingredient'}
        ],
    prepBowls: [String],
    directions: [String],
    specialEquipment: [String],
    notes: [String]

});

// Create Model
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe