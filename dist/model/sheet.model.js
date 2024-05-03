"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const sheetSchema = new mongoose_1.default.Schema({
    title: String,
    data: String,
    slug: {
        type: String,
        slug: "title",
        unique: true,
    },
}, {
    timestamps: true,
});
const Sheet = mongoose_1.default.model("Sheet", sheetSchema, "sheet");
exports.default = Sheet;
