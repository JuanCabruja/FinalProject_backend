const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

const validRoles = {
    values: ["ADMIN", "USER", "CREATOR"],
    message: "{VALUE} is not a valid role"
};

let addressSchema = new Schema({
    city: { type: String },
    street: { type: String },
    houseNumber: { type: String },
    zipCode: { type: String } 
});

let userInfoSchema = new Schema({
    name: { type: String },
    lastName: { type: String },
    contactInfo: { 
        phoneNumber: { type: String },
        address: [ addressSchema ]
    }
});

let userSchema = new Schema({
    username: {
        type: String,
        unique: [true, "Username already exist, please try another"],
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    avatar: {
        data: Buffer,
        contentType: String
    },
    description: {
        type: String,
    },
    role: {
        type: String,
        default: "USER",
        enum: validRoles
    },
    paymentMethods: {
        // TODO: A futuro implementar esto
    },
    userInfo: { 
        type: userInfoSchema 
    },
    active: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function() {
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.__v;

    return userObject;
}

userSchema.plugin(uniqueValidator, {message: "{PATH} should be unique"});

module.exports = mongoose.model("User", userSchema);