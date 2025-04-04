import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req , res) => {
    try {
        const {name , email , password , role,phoneNumber} = req.body;
        let user = await prisma.user.findFirst({ where : { email }})

        if(user){
            return res.status(402).json(new ApiError(402 , "User already exists"));
        }
        
        const hashedPassword = await bcrypt.hash(password , 10);
        
        user = await prisma.user.create({
            data : {
                name,
                email,
                password: hashedPassword,
                role,
                balance: 1000.0,
                phoneNumber
            }
        });

        const token = jwt.sign({userId : user.id , role} , process.env.JWT_SECRET)

        res.cookie("token" , token)

        return res.status(200).json(new ApiResponse(200 , "Signup Successful" , user));
    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
}


export const loginUser = async (req , res) => {
    try{
        const { email , password } = req.body;
        const user =await prisma.user.findFirst({
            where : {email}
        })

        if(!user){
            return res.status(404).json(new ApiError(404 , "User not found"));
        }

        const validPassword = await bcrypt.compare(password , user.password)
        if(!validPassword){
            return res.status(401).json(new ApiError(401 , "Invalid Credentials"));
        }

        let role = user.role;

        const token = jwt.sign(
            {userId : user.id , role},
            process.env.JWT_SECRET,
        )
        // console.log(token)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json(new ApiResponse(200 , "Login Successfull" , user))
    }catch(err){
        console.log(err);
        return res.status(500).json(new ApiError(500 , "internal Server Error"));
    }
}