const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    user_mail: String,
    user_pass: String,
    user_name: String,
    user_phone: Number,
    user_add: String,
    user_level: Number,
    user_number: Number,
    user_img: String,
    user_status: Number,
});

mongoose.model("User", UserSchema, "users");