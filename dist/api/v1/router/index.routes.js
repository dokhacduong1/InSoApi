"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_routes_1 = require("./home.routes");
const info_routes_1 = require("./info.routes");
const sheet_routes_1 = require("./sheet.routes");
const routesClientVersion1 = (app) => {
    const version = "/api/v1/client";
    app.use(version + "/home", home_routes_1.homeRoutes);
    app.use(version + "/info", info_routes_1.infoRoutes);
    app.use(version + "/sheets", sheet_routes_1.sheetRoutes);
};
exports.default = routesClientVersion1;
