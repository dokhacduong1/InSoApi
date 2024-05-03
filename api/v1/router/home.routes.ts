import {Router } from "express";
import * as controller from "../../v1/controller/client/home/home.controller";

const router : Router = Router();
router.get("/",controller.index)
router.get("/read-file-excel",controller.readFileExcel)
export const homeRoutes : Router  = router