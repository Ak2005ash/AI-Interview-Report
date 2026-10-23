const mongoose= require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "Username already taken"],
        required: true
    },

    email:{
        type: String,
        unique: [true,"Account already exist with this Email"],
        require: true,
    },

    password:{
        type: String,
        required: true
    }
})

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;