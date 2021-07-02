const mongoose = require("mongoose");


let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "A category is required"]
    },
    parent_category: {
        type: Schema.ObjectId, ref: "Category",
        required: [false]
    },
});


categorySchema.methods.toJSON = function() {
    const category = this; 
    const categoryObject = category.toObject();
    return categoryObject;
}

module.exports = mongoose.model("Category", categorySchema);