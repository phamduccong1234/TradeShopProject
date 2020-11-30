const mongoose = require("mongoose");
const Joi = require("@hapi/joi")
const fs = require("fs");
const path = require("path");
const {sendSignup} = require('../../../libs/sendMail');

const User = mongoose.model("User")
const Category = mongoose.model("Category")
const Product = mongoose.model("Product")

module.exports.login = function (req, res) {
    res.render("client/login", { error: "" });
}

module.exports.postLogin = async function (req, res) {
    const email = req.body.mail;
    const pass = req.body.pass;
    // const level = req.body.level;
    const user = await User.findOne({ user_mail: email })
    // console.log("user", user)
    
    let error = "Email or Password incorrect"

    if(user && user.user_pass === pass){
        req.session.user = user
        return res.redirect("/home")
    }
    res.render("client/login", {
        error
    })
};

module.exports.logout = async function (req, res) {
    req.session.destroy();
    res.redirect("/login")
}

module.exports.home = async function(req, res){
    const ProductFind = await Product.find().populate("user_id").populate("cate_id");
    res.render("client/home", {ProductFind});
}

module.exports.signup = async function(req, res){
    res.render("client/signup", {error: ""});
}

module.exports.store = async function(req, res){
    const email = req.body.user_mail
    const file = req.file
    if (file) {
        const pathUpload = path.resolve("src", "public", "client", "images", "User")
        const contentFile = fs.readFileSync(file.path)
        fs.unlinkSync(file.path)
        fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile)
    }    

    const bodySchema = Joi.object({
        user_pass: Joi.string().required(),
        user_name: Joi.string().required(),
        user_phone : Joi.number().required(),
        user_add : Joi.string().required(),
    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    
    if (value instanceof Error) {
        return res.redirect("/login")
    }
    let error
    const user = await User.findOne({ user_mail: email })

    if (user) {
        error = "Email has already signup"
    }

    if (!user ) {
        const random = Math.floor(Math.random() * 10000) + 1;

        const user = new User({
            user_mail: value.user_mail,
            user_pass: value.user_pass,
            user_name: value.user_name,
            user_phone: value.user_phone,
            user_add: value.user_add,
            user_number: random,
            user_level: 0,
            user_img: file.originalname,
            user_status: 0
        })

        await user.save()
    
        sendSignup(value.user_mail, random)
        return res.redirect("/verify")
    }
    req.flash("error", "Email has already")
    res.redirect("/login")
}

module.exports.verify = async function(req, res){
    res.render("client/verify", ({error: ""}));
}

module.exports.check = async function(req, res){
    const mail = req.body.email;
    const activecode = req.body.code;
    const user = await User.findOne({user_mail: mail})

    let error;
    if(!user){
        error = "User Not Found !!!"
    }
    
    if(user && user.user_number !== activecode){
        error = "Active Code incorrect !!!"
    }
    
    if(user && user.user_number == activecode){
        
        await User.updateOne({
            _id: user._id
        }, {
            $set: {
                user_status: true
            }
        })
        return res.redirect("/login");
    }
    req.flash("error", "Active Code incorrect")
    res.redirect("/verify");
}

module.exports.addproduct = async function(req, res){
    const categories = await Category.find()
    res.render("client/addproduct", {categories, error: ""})
}

module.exports.save = async function(req, res){
    const file = req.file
    const user = req.session.user;
    if (file) {
        const pathUpload = path.resolve("src", "public", "client", "images", "Product")
        const contentFile = fs.readFileSync(file.path)
        fs.unlinkSync(file.path)
        fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile)
    }
    
    const bodySchema = Joi.object({
        prd_price: Joi.required(),
        prd_name: Joi.required(),
        prd_detail: Joi.required(),
    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    console.log("value", value)
    if (value instanceof Error) {
        return res.redirect("/addproduct")
    }

    const product = new Product({
        prd_name: value.prd_name,
        cate_id: value.cate_id,
        user_id: user._id,
        prd_quality: value.prd_quality,
        prd_price: value.prd_price,
        prd_type: value.prd_type,
        prd_detail: value.prd_detail,
        prd_img: file.originalname,
    })

    await product.save();

    return res.redirect("/home");

}

module.exports.category = async function(req, res){
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Id not found!!!")
    }

    const totalDocuments = await Product.find({ cate_id: id }).countDocuments()

    const category = await Category.findById(id)

    const products = await Product.find({ cate_id: id })

    res.render("client/category", { products, category, total: totalDocuments })
}

module.exports.productDetail = async function(req, res){
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Id not found!!!")
    }

    const product = await Product.findById(id).populate("user_id").populate("cate_id");

    if (!product) throw new Error("Product not found!!!")

    res.render("client/productDetail", { product })
}

module.exports.userDetail = async function(req, res){
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Id not found!!!")
    }

    const user = await User.findById(id)

    if(!user) throw new Error("User not found!!!")

    res.render("client/userDetail", { user })
}

module.exports.userProfile = async function(req, res){
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Id not found!!!")
    }

    const user = await User.findById(id)
    const ProductById = await Product.find({user_id:id}).populate("user_id").populate("cate_id");

    if(!user) throw new Error("User not found!!!")

    res.render("client/userProfile", { user,ProductById })
}

module.exports.editUser = async function(req, res){
    const { id } = req.params
    const user = await User.findById(id)
    res.render("client/edituser", { user, error: ""} )
}

module.exports.updateUser = async function(req, res){
    const { id } = req.params
    const file = req.file
    if (file) {
        const pathUpload = path.resolve("src", "public", "client", "images", "User")
        const contentFile = fs.readFileSync(file.path)
        fs.unlinkSync(file.path)
        fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile)
    }

    const bodySchema = Joi.object({
        user_name: Joi.string().required(),
    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    if (value instanceof Error) {
        return res.redirect(`/edit-user-${id}`)
    }

        const userUpdate = {
            user_mail: value.user_mail,
            user_pass: value.user_pass,
            user_name: value.user_name,
            user_phone: value.user_phone,
            user_add: value.user_add,
            user_number: value.user_number,
            user_level: 0,
            user_status: 0
        }
        if(file){
            userUpdate['user_img'] = file.originalname
        }
        await User.updateOne({ _id: id }, { $set: userUpdate })
        return res.redirect(`/user-profile-${id}`)
}

module.exports.deleteProduct = async function(req, res){
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Id not found!!!")
    }
    
    const product = await Product.findByIdAndDelete(id)
    if (product) {
        const pathUpload = path.resolve("src", "public", "client", "images", "Product")
        if (fs.existsSync(path.join(pathUpload, product.prd_img))) {
            fs.unlinkSync(path.join(pathUpload, product.prd_img))
        }
    }
    return res.redirect(`/user-profile-${id}`)
}

module.exports.editProduct = async function(req, res){
    const { id } = req.params
    const product = await Product.findById(id).populate("user_id").populate("cate_id");
    const categories = await Category.find()
    res.render("client/editproduct", {categories,product, error: ""} )
}

module.exports.updateProduct = async function(req, res){
    const { id } = req.params
    const user = req.session.user;
    const file = req.file
    if (file) {
        const pathUpload = path.resolve("src", "public", "client", "images", "Product")
        const contentFile = fs.readFileSync(file.path)
        fs.unlinkSync(file.path)
        fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile)
    }
    const bodySchema = Joi.object({
        prd_price: Joi.required(),
        prd_name: Joi.required(),
        prd_detail: Joi.required(),
    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    console.log("value", value)
    if (value instanceof Error) {
        return res.redirect(`/edit-product-${id}`)
    }

    const productUpdate = {
        prd_name: value.prd_name,
        cate_id: value.cate_id,
        user_id: user._id,
        prd_status: value.prd_status,
        prd_quality: value.prd_quality,
        prd_price: value.prd_price,
        prd_type: value.prd_type,
        prd_detail: value.prd_detail
    }
    if(file){
        productUpdate['prd_img'] = file.originalname
    }
    await Product.updateOne({ _id: id }, { $set: productUpdate })
    return res.redirect("/home")

}

module.exports.search = async function(req, res){
    try {
        const {searchKey = "" } = req.query;

        const products = await Product.find({
            $text: {
                $search: searchKey,
            },
        });
        return res.render("client/search", {searchKey, products });
    } catch (error) {
        next(error);
    }
}



