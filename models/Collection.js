const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let Autor = mongoose.model('User');

let collectionSchema = new Schema({
    name: {
        type: String,
        required: [true, "Collection name is required"]
    },
    category: {
        type: String, 
        required: [true, "Collection type is needed"]
    }, 
    supply: {
        type: Number, 
        required: [true, "Collection supply amount is needed"]
    },
    price: {
        type: Number, 
        required: [true, "Initial price is required"]
    },
    description: {
        type: String,
        required: [true, "Collection description is required"]
    },
    author: {
        type: Schema.ObjectId, ref: "User"
    }
});

collectionSchema.methods.toJSON = function() {
    const collection = this; 

    const collectionObject = collection.toObject();

    return collectionObject;
}

module.exports = mongoose.model("Collection", collectionSchema);