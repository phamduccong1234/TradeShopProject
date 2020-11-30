const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    cate_id:{ 
        type: mongoose.Schema.ObjectId,
        ref: "Category"
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    prd_price: String,
    prd_quality: String,
    prd_type: String,
    prd_detail: String,
    prd_name: {
        type: String,
        text: true,
    },
    prd_img: String,
},
{
    timestamps: true,
});

mongoose.model("Product", ProductSchema, "products");