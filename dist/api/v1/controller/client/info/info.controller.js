"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editInfo = exports.deleteInfo = exports.createInfo = exports.index = void 0;
const info_model_1 = __importDefault(require("../../../../../model/info.model"));
const convertToSlug_1 = require("../../../helpers/convertToSlug");
const filterQueryPagination_1 = require("../../../helpers/filterQueryPagination.");
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const find = {};
            let querySortKey = "";
            let querySortValue = "";
            let queryPage = 1;
            let queryLimit = 6;
            if (req.query.sortKey) {
                querySortKey = req.query.sortKey.toString() || "homeowners";
            }
            if (req.query.sortValue) {
                querySortValue = req.query.sortValue.toString() || "asc";
            }
            if (req.query.page) {
                queryPage = parseInt(req.query.page.toString());
            }
            if (req.query.limit) {
                queryLimit = parseInt(req.query.limit.toString());
            }
            if (req.query.keyword) {
                const keyword = req.query.keyword.toString();
                const keywordRegex = new RegExp(keyword, "i");
                const unidecodeSlug = (0, convertToSlug_1.convertToSlug)(keyword);
                const slugRegex = new RegExp(unidecodeSlug, "i");
                find["$or"] = [
                    { homeowners: keywordRegex },
                    { slug: slugRegex },
                    { address: keywordRegex },
                ];
            }
            const countRecord = yield info_model_1.default.countDocuments(find);
            const objectPagination = (0, filterQueryPagination_1.filterQueryPagination)(countRecord, queryPage, queryLimit);
            let sort = {};
            if (querySortKey && querySortValue) {
                sort = {
                    [querySortKey]: querySortValue,
                };
            }
            const countRecordModal = Math.round(countRecord / queryLimit);
            let records = [];
            if (req.query.findAll) {
                records = yield info_model_1.default.find(find).sort(sort).select("");
            }
            else {
                records = yield info_model_1.default.find(find)
                    .sort(sort)
                    .limit(objectPagination.limitItem || 4)
                    .skip(objectPagination.skip || 0)
                    .select("");
            }
            res
                .status(200)
                .json({ data: records, code: 200, countRecordModal: countRecordModal });
        }
        catch (error) {
            console.error("Error in API:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.index = index;
const createInfo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { homeowners, age, wife_homeowners, wife_age, address, info_children, } = req.body;
            const record = new info_model_1.default({
                homeowners,
                age,
                wife_homeowners: wife_homeowners || "",
                wife_age: wife_age || 0,
                address,
                info_children: info_children || [],
            });
            yield record.save();
            res.status(200).json({ code: 200, success: "Thêm dữ liệu thành công." });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};
exports.createInfo = createInfo;
const deleteInfo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            yield info_model_1.default.deleteOne({ _id: id });
            res.status(200).json({ code: 200, success: "Xóa dữ liệu thành công." });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};
exports.deleteInfo = deleteInfo;
const editInfo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.body._id;
            const { homeowners, age, wife_homeowners, wife_age, address, info_children, } = req.body;
            const record = {
                homeowners,
                age,
                wife_homeowners: wife_homeowners || "",
                wife_age: wife_age || 0,
                address,
                info_children: info_children || [],
            };
            yield info_model_1.default.updateOne({ _id: id }, record);
            res.status(200).json({ code: 200, success: "Sửa liệu thành công." });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};
exports.editInfo = editInfo;
