const mongoose = require('mongoose');

const {Schema} = mongoose;

const ingredientSchema = new Schema({
    amount: Number,
    measure: String,
    prep: String,
    ingredient: String,
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe'
    }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;