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
Object.defineProperty(exports, "__esModule", { value: true });
exports.printSheet = exports.deleteSheet = exports.editSheet = exports.createSheet = void 0;
const createSheet = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { file } = req;
        if (!title) {
            res.status(400).json({
                code: 400,
                message: "Vui lòng nhập tiêu đề.",
            });
            return;
        }
        if (!file) {
            res.status(400).json({
                code: 400,
                message: "Vui lòng chọn file.",
            });
            return;
        }
        next();
        try {
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};
exports.createSheet = createSheet;
const editSheet = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title } = req.body;
        const { file } = req;
        if (!title) {
            res.status(400).json({
                code: 400,
                message: "Vui lòng nhập tiêu đề.",
            });
            return;
        }
        if (!file) {
            res.status(400).json({
                code: 400,
                message: "Vui lòng chọn file.",
            });
            return;
        }
        next();
        try {
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};
exports.editSheet = editSheet;
const deleteSheet = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.query;
        if (!id) {
            res.status(400).json({
                code: 400,
                message: "Vui lòng nhập id.",
            });
            return;
        }
        next();
        try {
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    });
};
exports.deleteSheet = deleteSheet;
const printSheet = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { listIdInfo, sheetId, date } = req.body;
            if (listIdInfo.length === 0) {
                res.status(400).json({
                    code: 400,
                    message: "Vui lòng nhập listIdInfo.",
                });
                return;
            }
            if (!sheetId) {
                res.status(400).json({
                    code: 400,
                    message: "Vui lòng nhập sheetId.",
                });
                return;
            }
            if (!date) {
                res.status(400).json({
                    code: 400,
                    message: "Vui lòng nhập date.",
                });
                return;
            }
            next();
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
            });
            console.log(error);
        }
    });
};
exports.printSheet = printSheet;
