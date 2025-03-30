import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";

export const Do_transaction = async (req, res) => {
  try {
    if (!req.user || !req.user.phoneNumber) {
      return res
        .status(401)
        .json(new ApiError(401, "Unauthorized: Please login first"));
    }

    const { receiverPhone, amount } = req.body;
    const senderPhone = req.user.phoneNumber; // Get sender's phone number from authenticated user

    // Validate input
    if (!receiverPhone || !amount) {
      return res
        .status(400)
        .json(new ApiError(400, "Receiver phone and amount are required"));
    }

    if (amount <= 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Amount must be greater than zero"));
    }

    if (senderPhone === receiverPhone) {
      return res
        .status(400)
        .json(new ApiError(400, "Cannot send money to yourself"));
    }

    // Fetch sender and receiver using phone numbers
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { phoneNumber: senderPhone } }),
      prisma.user.findUnique({ where: { phoneNumber: receiverPhone } }),
    ]);

    if (!sender)
      return res.status(404).json(new ApiError(404, "Sender not found"));
    if (!receiver)
      return res.status(404).json(new ApiError(404, "Receiver not found"));

    // Check if sender has enough balance
    if (sender.balance < amount) {
      return res.status(400).json(new ApiError(400, "Insufficient balance"));
    }


    // Perform transaction atomically
    const transaction = await prisma.$transaction(async (prisma) => {
      await prisma.user.update({
        where: { phoneNumber: senderPhone },
        data: { balance: { decrement: Number(amount) } },
      });

      await prisma.user.update({
        where: { phoneNumber: receiverPhone },
        data: { balance: { increment: Number(amount) } },
      });
      // fetch("http://127.0.0.1:5000/predict", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     scaled_time: 169351,
      //     V1: -0.67614,
      //     V2: 1.126366,
      //     V3: -2.2137,
      //     V4: 0.468308,
      //     V5: -1.12054,
      //     V6: -0.00335,
      //     V7: -2.23474,
      //     V8: 1.210158,
      //     V9: -0.65225,
      //     V10: -3.46389,
      //     V11: 1.794969,
      //     V12: -2.77502,
      //     V13: -0.41895,
      //     V14: -4.05716,
      //     V15: -0.71262,
      //     V16: -1.60301,
      //     V17: -5.03533,
      //     V18: -0.507,
      //     V19: 0.266272,
      //     V20: 0.247968,
      //     V21: 0.751826,
      //     V22: 0.834108,
      //     V23: 0.190944,
      //     V24: 0.03207,
      //     V25: -0.73969,
      //     V26: 0.471111,
      //     V27: 0.385107,
      //     V28: 0.194361,
      //     scaled_amount: 77.89
      //   }),
      // })
      //   .then((res) => res.json())
      //   .then((data) => console.log("Prediction:", data))
      //   .catch((err) => console.error(err));
      
      
      
      return await prisma.transaction.create({
        data: {
          receiverId: receiver.id,
          amount: Number(amount),
          transactionTime: new Date(),
          userId: sender.id,
        },
      });
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Transaction completed successfully", transaction)
      );
  } catch (err) {
    console.error("Transaction Error:", err);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
export const GetHistory = async (req, res) => {
    try {
      const userId = req.user.id;
      console.log(userId)
      const history = await prisma.transaction.findMany({
        where: {
          OR: [
            { userId: userId }, 
            { receiverId: userId }  
          ]
        },
        include: {
          user: true    
        }
      });
      
  
      return res.status(200).json(new ApiResponse(200, "Transaction history retrieved successfully" ,history));
    } catch (err) {
      return res.status(500).json(new ApiError(500, "Server Error"));
    }
  };
  