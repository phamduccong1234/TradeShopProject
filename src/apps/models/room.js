const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
   name: {
       type: String
   },
   type: {
       type: String,
       enum: ["private"],
       default: "private"
   },
   users: [
       {
           type: mongoose.Types.ObjectId,
           ref: "User"
       }
   ]
}, {
    timestamps: true
});

mongoose.model("Room", RoomSchema, "rooms");