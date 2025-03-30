import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";

export const Do_transaction = async (req, res) => {
    try {
        if (!req.user || !req.user.phoneNumber) {
            return res.status(401).json(new ApiError(401, "Unauthorized: Please login first"));
        }

        const { receiverPhone, amount } = req.body;
        const senderPhone = req.user.phoneNumber; // Get sender's phone number from authenticated user

        // Validate input
        if (!receiverPhone || !amount) {
            return res.status(400).json(new ApiError(400, "Receiver phone and amount are required"));
        }

        if (amount <= 0) {
            return res.status(400).json(new ApiError(400, "Amount must be greater than zero"));
        }

        if (senderPhone === receiverPhone) {
            return res.status(400).json(new ApiError(400, "Cannot send money to yourself"));
        }

        // Fetch sender and receiver using phone numbers
        const [sender, receiver] = await Promise.all([
            prisma.user.findUnique({ where: { phoneNumber: senderPhone } }),
            prisma.user.findUnique({ where: { phoneNumber: receiverPhone } })
        ]);

        if (!sender) return res.status(404).json(new ApiError(404, "Sender not found"));
        if (!receiver) return res.status(404).json(new ApiError(404, "Receiver not found"));

        // Check if sender has enough balance
        if (sender.balance < amount) {
            return res.status(400).json(new ApiError(400, "Insufficient balance"));
        }

        const now = new Date();

        // Perform transaction atomically
        const transaction = await prisma.$transaction(async (prisma) => {
            await prisma.user.update({
                where: { phoneNumber: senderPhone },
                data: { balance: { decrement: amount } }
            });

            await prisma.user.update({
                where: { phoneNumber: receiverPhone },
                data: { balance: { increment: amount } }
            });

            fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scaled_amount: amount,  
                    scaled_time: new Date().getTime(),      
                    "V1": -5,
  "V2": 10,
  "V3": 20,
  "V4": -15,
"V5": 30,
  "V6": -25,
  "V7": 5,
  "V8": -10,
  "V9": 15,
  "V10": -20,
  "V11": 25,
  "V12": -30,
  "V13": 35,
  "V14": -40,
  "V15": 45,
  "V16": -50,
  "V17": 55,
  "V18": -60,
  "V19": 65,
  "V20": -70,
  "V21": 75,
  "V22": -80,
  "V23": 85,
  "V24": -90,
  "V25": 95,
  "V26": -100,
  "V27": 105,
  "V28": -110
                })
            })
            .then(res => res.json())
            .then(data => console.log("Prediction:", data)) 
            .catch(err => console.error(err));
            
            
            
            
            
            

            return await prisma.transaction.create({
                data: {
                    receiverId: receiver.id,
                    amount,
                    transactionTime: now,
                    userId: sender.id
                }
            });
        });

        return res.status(200).json(new ApiResponse(200, "Transaction completed successfully", transaction));

    } catch (err) {
        console.error("Transaction Error:", err);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};
