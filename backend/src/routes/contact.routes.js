import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";
import { contactSchema, validateRequest } from "../validations/common.validation.js";

const router = Router();

router.post("/", validateRequest(contactSchema, { format: "errors" }), submitContact);

export default router;
