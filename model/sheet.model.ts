import mongoose from "mongoose";

import slug from "mongoose-slug-updater";
mongoose.plugin(slug);
const sheetSchema = new mongoose.Schema(
  {
    title: String,
    data: String,
    positionAddress:Number,
    positionUserInfo:Number,
    positionSurname:{
      column:Number,
      row: Number
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sheet = mongoose.model("Sheet", sheetSchema, "sheet");

export default Sheet;
