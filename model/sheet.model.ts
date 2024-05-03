import mongoose from "mongoose";

import slug from "mongoose-slug-updater";
mongoose.plugin(slug);
const sheetSchema = new mongoose.Schema(
  {
    title: String,
    data: String,
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
