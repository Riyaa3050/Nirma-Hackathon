import express from "express"
import authRouter from "./src/routes/auth.routes.js"
import transactionRouter from "./src/routes/transaction.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./src/utils/prismClient.js";
dotenv.config();


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())


app.use('/auth' , authRouter);
app.use('/transaction' , transactionRouter);

app.listen(3000 , ()=> {
    console.log("http://localhost:3000");
})