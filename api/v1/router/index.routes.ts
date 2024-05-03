
import { Express } from "express";
import { homeRoutes } from "./home.routes";
import { infoRoutes } from "./info.routes";
import { sheetRoutes } from "./sheet.routes";

const routesClientVersion1 = (app: Express): void => {
    const version = "/api/v1/client";
    app.use(version + "/home",homeRoutes);
    app.use(version + "/info",infoRoutes);
    app.use(version + "/sheets",sheetRoutes);
}
export default routesClientVersion1