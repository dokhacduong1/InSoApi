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
exports.printSheet = exports.deleteSheet = exports.editSheet = exports.createSheet = exports.index = void 0;
const excel4node_1 = __importDefault(require("excel4node"));
const sheet_model_1 = __importDefault(require("../../../../../model/sheet.model"));
const xlsx_1 = __importDefault(require("xlsx"));
const convertToSlug_1 = require("../../../helpers/convertToSlug");
const filterQueryPagination_1 = require("../../../helpers/filterQueryPagination.");
const info_model_1 = __importDefault(require("../../../../../model/info.model"));
const convertDataInfo_1 = require("../../../helpers/convertDataInfo");
const optionsExecl_1 = require("../../../helpers/optionsExecl");
const sheetHelpers_1 = require("../../../helpers/sheetHelpers");
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
                find["$or"] = [{ title: keywordRegex }, { slug: slugRegex }];
            }
            const countRecord = yield sheet_model_1.default.countDocuments(find);
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
                records = yield sheet_model_1.default.find(find).sort(sort).select("");
            }
            else {
                records = yield sheet_model_1.default.find(find)
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
const createSheet = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const title = req.body.title;
            const positionUserInfo = req.body.positionUserInfo;
            const positionSurname = req.body.positionSurname;
            const [collumCheck, rowCheck] = positionSurname.split("/");
            let object0PositionUserInfo = {};
            if (collumCheck === "0" && rowCheck === "0") {
                object0PositionUserInfo = {
                    column: parseInt(collumCheck),
                    row: parseInt(rowCheck)
                };
            }
            const positionAddress = req.body.positionAddress;
            const buffer = req.file.buffer;
            const workbook = xlsx_1.default.read(buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            let arrObject = [];
            const range = xlsx_1.default.utils.decode_range(worksheet["!ref"]);
            for (let rowNum = range.s.r - 1; rowNum <= range.e.r; rowNum++) {
                for (let colNum = range.s.c - 1; colNum <= range.e.c; colNum++) {
                    const position = { r: rowNum + 1, c: colNum + 1 };
                    const cellIndex = xlsx_1.default.utils.encode_cell(position);
                    const positionChar = xlsx_1.default.utils.encode_cell({
                        r: rowNum + 1,
                        c: colNum + 1,
                    });
                    const cell = worksheet[cellIndex];
                    if (cell && cell.v) {
                        const value = cell.v.toString();
                        const ObjectValue = {
                            position: position,
                            value: value,
                            positionChar: positionChar,
                        };
                        arrObject.push(ObjectValue);
                    }
                }
            }
            arrObject.sort((a, b) => {
                if (a.positionChar < b.positionChar) {
                    return -1;
                }
                if (a.positionChar > b.positionChar) {
                    return 1;
                }
                return 0;
            });
            const stringFyData = JSON.stringify(arrObject);
            const record = {
                title: title,
                data: stringFyData,
                positionUserInfo: positionUserInfo,
                positionAddress: positionAddress,
            };
            if (Object.keys(object0PositionUserInfo).length > 0) {
                record["positionSurname"] = object0PositionUserInfo;
            }
            const fullRecord = new sheet_model_1.default(record);
            yield fullRecord.save();
            res.status(200).json({ code: 200, success: "Thêm dữ liệu thành công." });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
            console.log(error);
        }
    });
};
exports.createSheet = createSheet;
const editSheet = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.body._id;
            const title = req.body.title;
            const positionUserInfo = req.body.positionUserInfo;
            const positionAddress = req.body.positionAddress;
            const positionSurname = req.body.positionSurname;
            const [collumCheck, rowCheck] = positionSurname.split("/");
            let object0PositionUserInfo = {};
            if (collumCheck === "0" && rowCheck === "0") {
                object0PositionUserInfo = {
                    column: parseInt(collumCheck),
                    row: parseInt(rowCheck)
                };
            }
            const buffer = req.file.buffer;
            const record = {
                title: title,
                positionUserInfo: positionUserInfo,
                positionAddress: positionAddress,
            };
            if (Object.keys(object0PositionUserInfo).length > 0) {
                record["positionSurname"] = object0PositionUserInfo;
            }
            if (buffer) {
                const workbook = xlsx_1.default.read(buffer, { type: "buffer" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                let arrObject = [];
                const range = xlsx_1.default.utils.decode_range(worksheet["!ref"]);
                for (let rowNum = range.s.r - 1; rowNum <= range.e.r; rowNum++) {
                    for (let colNum = range.s.c - 1; colNum <= range.e.c; colNum++) {
                        const position = { r: rowNum + 1, c: colNum + 1 };
                        const cellIndex = xlsx_1.default.utils.encode_cell(position);
                        const positionChar = xlsx_1.default.utils.encode_cell({
                            r: rowNum + 1,
                            c: colNum + 1,
                        });
                        const cell = worksheet[cellIndex];
                        if (cell && cell.v) {
                            const value = cell.v.toString();
                            const ObjectValue = {
                                position: position,
                                value: value,
                                positionChar: positionChar,
                            };
                            arrObject.push(ObjectValue);
                        }
                    }
                }
                arrObject.sort((a, b) => {
                    if (a.positionChar < b.positionChar) {
                        return -1;
                    }
                    if (a.positionChar > b.positionChar) {
                        return 1;
                    }
                    return 0;
                });
                const stringFyData = JSON.stringify(arrObject);
                record["data"] = stringFyData;
            }
            yield sheet_model_1.default.updateOne({ _id: id }, record);
            res.status(200).json({ code: 200, success: "Sửa dữ liệu thành công." });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
            console.log(error);
        }
    });
};
exports.editSheet = editSheet;
const deleteSheet = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            yield sheet_model_1.default.deleteOne({ _id: id });
            res.status(200).json({ code: 200, success: "Xóa dữ liệu thành công." });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};
exports.deleteSheet = deleteSheet;
const printSheet = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const listIdInfo = req.body.listIdInfo;
            const listSheetId = req.body.sheetId;
            const dateInfo = req.body.date;
            const recordInfo = yield info_model_1.default.find({ _id: { $in: listIdInfo } });
            const recordSheets = yield sheet_model_1.default.find({ _id: { $in: listSheetId } });
            if (recordInfo.length === 0) {
                res
                    .status(200)
                    .json({ code: 200, success: "Không có dữ liệu cá nhân nào." });
                return;
            }
            if (recordSheets.length === 0) {
                res.status(200).json({ code: 200, success: "Không có dữ liệu sớ nào." });
                return;
            }
            const convertDataInfoAll = (0, convertDataInfo_1.convertDataInfo)(recordInfo);
            const wb = new excel4node_1.default.Workbook({
                defaultFont: {
                    size: 22,
                    name: "Arial",
                    bold: true,
                },
                font: {
                    bold: true,
                },
            });
            for (let recordSheet of recordSheets) {
                for (let i = 0; i < convertDataInfoAll.length; i++) {
                    const ws = wb.addWorksheet(`${convertDataInfoAll[i].slug}${new Date().getTime()}-${recordSheet === null || recordSheet === void 0 ? void 0 : recordSheet.slug}`, optionsExecl_1.optionsExecl);
                    const convertData = JSON.parse(recordSheet.data);
                    convertData.forEach((row, index) => {
                        ws.cell((row === null || row === void 0 ? void 0 : row.position["r"]) + 1, (row === null || row === void 0 ? void 0 : row.position["c"]) + 1)
                            .string(row.value)
                            .style({ border: optionsExecl_1.noBorderExecl });
                    });
                    (0, sheetHelpers_1.addUserInfo)(ws, convertDataInfoAll[i].infoConvert, recordSheet === null || recordSheet === void 0 ? void 0 : recordSheet.positionUserInfo);
                    (0, sheetHelpers_1.addAddress)(ws, convertDataInfoAll[i].address, recordSheet === null || recordSheet === void 0 ? void 0 : recordSheet.positionAddress);
                    (0, sheetHelpers_1.addDataCanChi)(ws);
                    (0, sheetHelpers_1.addNgayCung)(ws, dateInfo);
                    if (recordSheet === null || recordSheet === void 0 ? void 0 : recordSheet.positionSurname) {
                        const hoGiaChu = (_b = (_a = convertDataInfoAll[i]) === null || _a === void 0 ? void 0 : _a.homeowners) === null || _b === void 0 ? void 0 : _b.split(" ")[0];
                        (0, sheetHelpers_1.addThuongPhung)(ws, recordSheet === null || recordSheet === void 0 ? void 0 : recordSheet.positionSurname, hoGiaChu);
                    }
                }
            }
            const buffer = yield wb.writeToBuffer();
            res.status(200).json({ code: 200, data: buffer.toString("base64") });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};
exports.printSheet = printSheet;
