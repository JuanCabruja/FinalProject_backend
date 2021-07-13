const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let productSchema = new Schema({
    product_Owner: {
        type: Schema.ObjectId, 
        ref: "User"
    },
    product_Sale_Price: {
        type: Number, 
        required: [true, "Price is required"]
    },
    product_History: [{
       type: Schema.ObjectId,
       ref: "buySell"
    }],
    sellOrNot: {
        type: Boolean,
        default: true
    }, 
    parentCollection: {
        type: Schema.ObjectId, ref: "Collection",
        required: [true, "parent collection is needed"] 

    },
    productReSaleImages: {
        type: Array
    
    },
    productNumberInCollection: {
        type: Number, 
        required: [true]
    },
   
});

productSchema.methods.toJSON = function() {
    const product = this; 

    const productObject = product.toObject();
    delete productObject.__v;
    return productObject;
}

module.exports = mongoose.model("Product", productSchema);