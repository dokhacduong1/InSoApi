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
exports.editInfo = exports.deleteInfo = exports.createInfo = void 0;
const createInfo = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { homeowners, age, address } = req.body;
        if (!homeowners || !age || !address) {
            res.status(400).json({
                code: 400,
                message: "Vui lòng nhập đầy đủ thông tin.",
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
exports.createInfo = createInfo;
const deleteInfo = function (req, res, next) {
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
exports.deleteInfo = deleteInfo;
const editInfo = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { homeowners, age, address } = req.body;
        if (!homeowners || !age || !address) {
            res.status(400).json({
                code: 400,
                message: "Vui lòng nhập đầy đủ thông tin.",
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
exports.editInfo = editInfo;
