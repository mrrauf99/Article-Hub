import express from "express";
import { submitContact } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/", submitContact);

export default router;
