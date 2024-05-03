import {Router } from "express";
import * as controller from "../../v1/controller/client/sheet/sheet.controller";
import * as validate from "../../v1/validate/sheet.validate";
import multer from 'multer';
const router : Router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.get("/",controller.index)
router.post("/edit",upload.single('file'),validate.editSheet,controller.editSheet)
router.post("/create",upload.single('file'),validate.createSheet,controller.createSheet)
router.delete("/delete",validate.deleteSheet,controller.deleteSheet)
router.post("/print",validate.printSheet,controller.printSheet)
export const sheetRoutes : Router  = router