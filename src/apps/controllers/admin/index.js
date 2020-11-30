const mongoose = require("mongoose");

const Category = mongoose.model("Category");
const Product = mongoose.model("Product");
const User = mongoose.model("User")

module.exports.login = function (req, res) {
    res.render("client/login", { error: "" });
}

module.exports.postLogin = async function (req, res) {
    const email = req.body.mail;
    const pass = req.body.pass;
    // const level = req.body.level;
    const user = await User.findOne({ user_mail: email })
    // console.log("user", user)
    let error
    if (!user) {
        error = "Not found user"
    }
    
    if (!error && user && !user.user_status) {
        error = "user not active"
        await User.deleteMany({
            user_mail: email
        })
    }

    if (!error && user && user.user_pass !== pass) {
        error = "Password not match"
    }
    if (error) {
       return  res.render("client/login", {
            error
        })
    }

    req.session.user = user
    return res.redirect("/admin/dashboard")
    
};

module.exports.dashboard = async function (req, res) {

    const number_category = await Category.countDocuments();
    const number_product = await Product.countDocuments();
    const number_user = await User.countDocuments();

    res.render("admin/dashboard", { data: {}, number_category, number_product, number_user });
}

module.exports.logout = async function (req, res) {
    req.session.destroy();
    res.redirect("/login")
}

