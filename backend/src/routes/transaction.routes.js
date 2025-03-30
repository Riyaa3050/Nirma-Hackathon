import express from "express";
import isAuthenticated from "../middlewares/Authentication.js";
import { Do_transaction } from "../controllers/transaction.controller.js";

const router = express.Router();

router.post('/', isAuthenticated, Do_transaction);

export default router;
