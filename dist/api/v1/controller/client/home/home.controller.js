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
exports.readFileExcel = exports.index = void 0;
const excel4node_1 = __importDefault(require("excel4node"));
const xlsx_1 = __importDefault(require("xlsx"));
const sheet_model_1 = __importDefault(require("../../../../../model/sheet.model"));
const optionsExecl_1 = require("../../../helpers/optionsExecl");
const convertDataInfo_1 = require("../../../helpers/convertDataInfo");
const info_model_1 = __importDefault(require("../../../../../model/info.model"));
const index = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const recordInfo = yield info_model_1.default.find();
            const convertDataInfoAll = (0, convertDataInfo_1.convertDataInfo)(recordInfo);
            const record = yield sheet_model_1.default.findOne({ title: "Sớ gia tiên" });
            if (!record) {
                res.status(404).json({
                    message: "Record not found",
                });
                return;
            }
            const wb = new excel4node_1.default.Workbook({
                defaultFont: {
                    size: 16,
                    name: "Arial",
                    bool: true,
                },
            });
            for (let i = 0; i < convertDataInfoAll.length; i++) {
                const ws = wb.addWorksheet(convertDataInfoAll[i].slug + new Date().getTime(), optionsExecl_1.optionsExecl);
                const convertData = JSON.parse(record.data);
                convertData.forEach((row, index) => {
                    ws.cell(row === null || row === void 0 ? void 0 : row.position["r"], (row === null || row === void 0 ? void 0 : row.position["c"]) + 1)
                        .string(row.value)
                        .style({ border: optionsExecl_1.noBorderExecl });
                });
                let startColumn = 18;
                for (let j = 0; j < convertDataInfoAll[i].infoConvert.length; j++) {
                    let column = startColumn + Math.floor(j / 30);
                    let row = (j % 30) + 2;
                    ws.cell(row, column)
                        .string(convertDataInfoAll[i].infoConvert[j])
                        .style({ border: optionsExecl_1.noBorderExecl });
                }
                let addressSpilt = convertDataInfoAll[i].address.split(" ");
                let startColumnAddress = 22;
                for (let j = 0; j < addressSpilt.length; j++) {
                    let column = startColumnAddress + Math.floor(j / 30);
                    let row = (j % 30) + 5;
                    ws.cell(row, column)
                        .string(addressSpilt[j])
                        .style({ border: optionsExecl_1.noBorderExecl });
                }
                wb.write("output.xlsx");
            }
            res.status(200).json({
                message: "Welcome to the home page",
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
            console.log(error);
        }
    });
};
exports.index = index;
const readFileExcel = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const inputFile = "./api/v1/access/input.xlsx";
        try {
            const workbook = xlsx_1.default.readFile(inputFile);
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
            const record = new sheet_model_1.default({
                title: "Sớ gia tiên",
                data: stringFyData,
            });
            yield record.save();
            res.status(200).json({ code: 200, data: arrObject });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
            console.log(error);
        }
    });
};
exports.readFileExcel = readFileExcel;
