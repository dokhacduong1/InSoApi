"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const infoSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
const Info = mongoose_1.default.model("Info", infoSchema, "info");
exports.default = Info;
