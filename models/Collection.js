const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let imgSchema = new Schema({
    name: String,
    desc: String,
    img:{
        data: Buffer,
        contentType: String
    }
})

let collectionSchema = new Schema({
    name: {
        type: String,
        required: [true, "Collection name is required"]
    },
    supply: {
        type: Number, 
        required: [true, "Collection supply amount is needed"]
    },
    available: {
        type: Number, 
        required: [true]
    },
    price: {
        type: Number, 
        required: [true, "Initial price is required"]
    },
    images: {
        type: Array,
        required: [true]
    },
    description: {
        type: String,
        required: [true, "Collection description is required"]
    },
    author: {
        type: Schema.ObjectId, ref: "User",
        required: [true, "an author is needed"]
    }, 
    categories: [{type: Schema.ObjectId, ref: "category"}] 
});

collectionSchema.methods.toJSON = function() {
    const collection = this; 

    const collectionObject = collection.toObject();
    delete collectionObject.__v;
    return collectionObject;
}

module.exports = mongoose.model("Collection", collectionSchema);