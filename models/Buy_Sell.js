const mongoose = require("mongoose");


let Schema = mongoose.Schema;

let buySellSchema = new Schema({
    user_buyer: {
        type: Schema.ObjectId, ref: "User"
    },
    user_seller: {
        type: Schema.ObjectId, ref: "User"
    },
    product_Id: {
        type: Schema.ObjectId, ref: "Product"
    },
    sale_price: {
        type: Number,
        required: [true, "A sale price is required"]
    }, 
    date: {
        type: Date
    },
    state: {
        type: String,
        required:[true, "state is required"]   
    }
});


buySellSchema.methods.toJSON = function() {
    const buySell = this; 

    const buySellObject = buySell.toObject();

    return buySellObject;
}

module.exports = mongoose.model("buySell", buySellSchema);