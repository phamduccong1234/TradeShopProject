const mongoose = require("mongoose")

const RoomModel = mongoose.model("Room")

module.exports.chat = async function(req, res){
    const user = req.session.user;
    const user_id = user._id;
    const user_chat_id = req.query.id;

    let room;

    if (user_chat_id && user_chat_id !== user_id) {
        room = await RoomModel.findOne({
            users: {  $all: [user_id,user_chat_id ] }
        });
        console.log(room)
    }

    if (!room && user_chat_id && user_chat_id !== user_id) {
        room = await new RoomModel({
            users: [user_id, user_chat_id]
        }).save()
    }

    const rooms = await RoomModel.find({
        users: {
            $all: [user_id]
        }
    }).populate("users")


    if (!room) {
        room = rooms.length ? rooms[0] : null
    }

    res.render("chat/index", { rooms, user_id, user_chat_id, room })
}