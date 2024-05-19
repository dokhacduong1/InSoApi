"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addThuongPhung = exports.addNgayCung = exports.addDataCanChi = exports.addAddress = exports.addUserInfo = void 0;
const optionsExecl_1 = require("./optionsExecl");
const tinhCanChi_1 = require("./tinhCanChi");
function addUserInfo(ws, infoConvert, startColumn = 18) {
    for (let j = 0; j < infoConvert.length; j++) {
        const column = startColumn + 2 * Math.floor(j / 30);
        const row = (j % 30) + 2;
        ws.cell(row, column)
            .string(infoConvert[j])
            .style({ border: optionsExecl_1.noBorderExecl });
    }
}
exports.addUserInfo = addUserInfo;
function addAddress(ws, address, startColumnAddress = 22) {
    const addressSpilt = address.split(" ");
    for (let j = 0; j < addressSpilt.length; j++) {
        const column = startColumnAddress + 2 + Math.floor(j / 30);
        const row = (j % 30) + 5;
        ws.cell(row, column)
            .string(addressSpilt[j])
            .style({ border: optionsExecl_1.noBorderExecl });
    }
}
exports.addAddress = addAddress;
function addDataCanChi(ws) {
    const year = new Date().getFullYear();
    const canChi = (0, tinhCanChi_1.tinhCanChi)(year);
    ws.cell(4, 2).string(canChi["can"]).style({ border: optionsExecl_1.noBorderExecl });
    ws.cell(11, 2).string(canChi["chi"]).style({ border: optionsExecl_1.noBorderExecl });
}
exports.addDataCanChi = addDataCanChi;
function addNgayCung(ws, dataInfo) {
    const day = new Date(dataInfo).getDate();
    const month = new Date(dataInfo).getMonth() + 1;
    ws.cell(13, 2).string(month.toString()).style({ border: optionsExecl_1.noBorderExecl });
    ws.cell(18, 2).string(day.toString()).style({ border: optionsExecl_1.noBorderExecl });
}
exports.addNgayCung = addNgayCung;
function addThuongPhung(ws, positionSurname, hoGiaChu) {
    ws.cell(positionSurname === null || positionSurname === void 0 ? void 0 : positionSurname.row, positionSurname === null || positionSurname === void 0 ? void 0 : positionSurname.column).string(hoGiaChu.toString()).style({ border: optionsExecl_1.noBorderExecl });
}
exports.addThuongPhung = addThuongPhung;
