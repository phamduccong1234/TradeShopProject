const mongoose = require("mongoose");
const Product = mongoose.model("Product");

module.exports.manageproduct = async function(req, res){
    const products = await Product.find().populate("user_id").populate("cate_id");

    res.render("admin/managepost", { products });
};

module.exports.destroy = async function(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.redirect("/admin/product")
    }
    const product = await Product.findByIdAndDelete(id)
    if (product) {
        const pathUpload = path.resolve("src", "public", "client", "images", "Product")
        if (fs.existsSync(path.join(pathUpload, product.prd_img))) {
            fs.unlinkSync(path.join(pathUpload, product.prd_img))
        }
    }
    return res.redirect("/admin/product")
}