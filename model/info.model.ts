import mongoose from "mongoose";

import slug from "mongoose-slug-updater";
mongoose.plugin(slug);
const infoSchema = new mongoose.Schema(
  {
    homeowners: String,
    age: Number,
    wife_homeowners: String,
    wife_age: Number,
    address: String,
    info_children: Array,
    slug: {
      type: String,
      slug: "homeowners",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Info = mongoose.model("Info", infoSchema, "info");

export default Info;
