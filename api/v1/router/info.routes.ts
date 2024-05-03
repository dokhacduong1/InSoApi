import {Router } from "express";
import * as controller from "../../v1/controller/client/info/info.controller";
import * as validate from "../../v1/validate/info.validate";
const router : Router = Router();
router.get("/",controller.index)
router.post("/create",validate.createInfo,controller.createInfo)
router.post("/edit",validate.editInfo,controller.editInfo)
router.delete("/delete",validate.deleteInfo,controller.deleteInfo)
export const infoRoutes : Router  = router