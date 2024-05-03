"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tinhCanChi = void 0;
function tinhCanChi(nam) {
    var arrCan = [
        "Canh",
        "Tân",
        "Nhâm",
        "Quý",
        "Giáp",
        "Ất",
        "Bính",
        "Đinh",
        "Mậu",
        "Kỷ",
    ];
    var arrChi = [
        "Thân",
        "Dậu",
        "Tuất",
        "Hợi",
        "Tí",
        "Sửu",
        "Dần",
        "Mão",
        "Thìn",
        "Tỵ",
        "Ngọ",
        "Mùi",
    ];
    var can = arrCan[nam % 10];
    var chi = arrChi[nam % 12];
    return {
        can: can,
        chi: chi,
    };
}
exports.tinhCanChi = tinhCanChi;
