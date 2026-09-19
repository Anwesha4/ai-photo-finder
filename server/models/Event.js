import mongoose from "mongoose";

const faceSchema = new mongoose.Schema(
  {
    embedding: {
      type: [Number],
      required: true,
    },
    boundingBox: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const photoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    faces: {
      type: [faceSchema],
      default: [],
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },
    deletePin: {
      type: String,
      required: true,
    },

    photos: {
      type: [photoSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;