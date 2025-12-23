import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";

const router = Router();

router.post("/", submitContact);

export default router;
