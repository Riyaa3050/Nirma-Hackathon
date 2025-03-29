import express from "express"
import isAuthenticated from "../middlewares/Authentication.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Do_transaction } from "../controllers/transaction.controller.js";
const router = express.Router();

router.post('/transaction' ,isAuthenticated , Do_transaction);

export default router;