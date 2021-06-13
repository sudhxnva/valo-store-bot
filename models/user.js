const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  discordID: {
    type: String,
    unique: true,
    required: true,
  },
  discordName: String,
  shard: {
    type: String,
    enum: ["NA", "EU", "AP", "KR"],
  },
  riotUsername: {
    type: String,
    required: true,
  },
  riotPassword: {
    iv: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
});

exports.User = model("User", userSchema);
