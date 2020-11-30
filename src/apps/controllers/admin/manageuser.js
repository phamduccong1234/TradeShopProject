const mongoose = require("mongoose")
const User = mongoose.model("User")
const Product = mongoose.model("Product")
const Room = mongoose.model("Room")

module.exports.manageuser = async function(req, res) {
    const page = parseInt(req.query.page)
    const limit = 8;
    const skip = (page - 1) * limit

    const totalDocuments = await User.find().countDocuments()
        //console.log(totalDocuments);

    const totalPages = Math.ceil(totalDocuments / limit)
    const range = []
    const rangerForDot = []
    const deltal = 1

    const left = page - deltal
    const right = page + deltal
        //console.log(right)
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i <= right)) {
            range.push(i)
        }
    }
    //console.log(range)
    let temp
    range.map((i) => {
        if (temp) {
            if (i - temp === 2) {
                rangerForDot.push(i - 1)
            } else if (i - temp !== 1) {
                rangerForDot.push("...")
            }
        }
        temp = i
            //console.log("temp", temp)
        rangerForDot.push(i)

    })
    const users = await User.find().limit(limit).skip(skip)

    //console.log(users)
    res.render("admin/manageuser", {
        users,
        range: rangerForDot,
        page,
        totalPages
    })
}

module.exports.deleteuser = async function(req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.redirect("/admin/user")
    }
    await User.findByIdAndDelete(id)
    await Product.deleteMany({
        user_id: id
    })
    await Room.deleteMany({
        users: {
            $all: [id]
        }
    })
    return res.redirect("/admin/user")
}