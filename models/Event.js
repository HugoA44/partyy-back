const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    begindate: {
      type: Date,
      required: false,
    },
    enddate: {
      type: Date,
      required: false,
    },
    isPrivate: {
      type: Boolean,
      required: false,
    },
    guests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
