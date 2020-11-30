const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  body: {
      type: String
  },
  author_id: {
      type: mongoose.Types.ObjectId,
      ref: "User"
  },
  room_id: {
      type: mongoose.Types.ObjectId,
      ref: "Room"
  }
   
}, {
    timestamps: true
});

mongoose.model("Message", MessageSchema, "messages");