const mongoose = require("mongoose")
const Joi = require("@hapi/joi")

const Category = mongoose.model("Category")

module.exports.managecategory = async function (req, res) {

    const categories = await Category.find()

    res.render("admin/managecategory", { categories, error: "" })
}

module.exports.editcategory = async function (req, res) {
    const { id } = req.params
    const category = await Category.findById(id)
    res.render("admin/editcategory", { category, error: "" })
}

module.exports.updateCategory = async function (req, res) {
    const { id } = req.params
    const name = req.body.cate_name
    const bodySchema = Joi.object().keys({
        cate_name: Joi.string().required()
    }).unknown()
    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    if (value instanceof Error) {
        return res.redirect(`/admin/editcategory/${id}`)
    } 
    let error
    const category = await Category.findOne({cate_id: name})
    if(category && name === category.cate_name){
        error = "Category Name exist"
    }
    
    if (category && name !== category.cate_name) {
        await Category.updateOne({
            _id: id
        }, {
            $set: {
                cate_name: value.cate_name
            }
        })
        return res.redirect("/admin/category")
    }
    req.flash("error", "Category Name exist")
    res.redirect(`/admin/editcategory/${id}`)
}

module.exports.addcategory = async function (req, res) {
    res.render("admin/addcategory", { error: "" })
}

module.exports.store = async function (req, res) {
    const name = req.body.cate_name
    const bodySchema = Joi.object({
        cate_name: Joi.string().required()
    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    if (value instanceof Error) {
        return res.redirect("/admin/addcategory")
    }
    let error
    const cate = await Category.findOne({ cate_name: name })

    if (cate) {
        error = "Category exist"
    }

    if (!cate) {
        const cate_new = new Category({
            cate_name: value.cate_name
        })

        await cate_new.save()
        return res.redirect("/admin/category")
    }
    req.flash("error", "Category exist")
    res.redirect("/admin/category")
}
