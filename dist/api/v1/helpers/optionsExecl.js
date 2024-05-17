"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noBorderExecl = exports.optionsExecl = void 0;
exports.optionsExecl = {
    margins: {
        left: 1.5,
        right: 0.25,
        top: 0,
        bottom: 1.25,
        header: 0,
        footer: 0,
    },
    sheetFormat: {
        thickBottom: false,
        thickTop: false,
        baseColWidth: 10,
        defaultColWidth: 10,
    },
    printOptions: {
        centerHorizontal: true,
        centerVertical: true,
    },
    sheetView: {
        showGridLines: false,
    },
};
exports.noBorderExecl = {
    top: { style: "none" },
    left: { style: "none" },
    bottom: { style: "none" },
    right: { style: "none" },
};
