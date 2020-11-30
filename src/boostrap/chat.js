const socketIo = require("socket.io")
const mongoose = require("mongoose");
const sharedsession = require("express-socket.io-session");
const session = require("./app").session


const RoomModel = mongoose.model("Room");
const MessageModel = mongoose.model("Message")

module.exports = function(server){
    const io = socketIo(server)

    io.use(sharedsession(session, {
        autoSave: true
    }));

    io.use((socket, next) => {
        if (socket.handshake.session && socket.handshake.session.user) {
            socket.user = socket.handshake.session.user;
            next()
        } else {
            const err = new Error("Not user");
            next(err)
        }
    })

    io.on("connection", function(socket){

         function checkUserInRoom(room_id) {
            const user_id = socket.user._id;
            const room =  RoomModel.findOne({
                _id: room_id,
                users: { $all: [user_id] }
            });
            return room
        }

        if (socket && socket.user && socket.user._id) {
            socket.join(socket.user._id);

        }

        socket.on("START_CHAT",async function(data){
            const {type, id} = data;
            if (!id) return
            let room;
            if (type === "room") {
                room = await RoomModel.findById({_id: id}).populate("users")
            }

            if (room) {
                socket.emit("START_CHAT_SUCCESS", { room })
            }
        } );

        socket.on("GET_MESSAGE", async function ({room_id}) {

            const room = await checkUserInRoom(room_id)

            if (room) {
                const messages = await MessageModel.find({
                    room_id: room_id
                }).sort("-_id");

                socket.emit("GET_MESSAGE_SUCCESS", { messages })
            }

        })
        
        socket.on("NEW_MESSAGE", async function ({room_id, body}) {

            const room = await checkUserInRoom(room_id)
            const user_id = socket.user._id;
            if (!room) return
            const mess = await new MessageModel({
                room_id,
                body,
                author_id: user_id
            }).save();

            socket.emit("NEW_MESSAGE_SUCCESS", { mess });
            room.users.map(u => socket.to(u.toString()))
            socket.emit("NEW_MESSAGE_SUCCESS", { mess });

        })
    
    })
}