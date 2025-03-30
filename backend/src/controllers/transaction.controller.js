import axios from "axios"; 
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
    const senderPhone = req.user.phoneNumber;

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

    // Fetch sender and receiver
    const [sender, receiver] = await Promise.all([
      prisma.user.findUnique({ where: { phoneNumber: senderPhone } }),
      prisma.user.findUnique({ where: { phoneNumber: receiverPhone } }),
    ]);

    if (!sender)
      return res.status(404).json(new ApiError(404, "Sender not found"));
    if (!receiver)
      return res.status(404).json(new ApiError(404, "Receiver not found"));

    if (sender.balance < amount) {
      return res.status(400).json(new ApiError(400, "Insufficient balance"));
    }

    // Prepare data for ML model
    const transactionData = {
      SenderID: sender.id,
      ReceiverID: receiver.id,
      Currency: "USD", // Adjust as needed
      TransactionType: "Online", // Adjust as needed
      Amount: amount,
      Timestamp: new Date().toISOString(),
    };

    // Call the ML model API
    const predictionResponse = await axios.post(
      "http://127.0.0.1:5000/predict", // Update if your API is hosted elsewhere
      transactionData
    );

    let fraudProbability = predictionResponse.data.fraud_probability;
    fraudProbability = (fraudProbability * 100).toFixed(2); // Convert to percentage with 2 digits before & 2 after decimal

    const fraudPrediction = predictionResponse.data.fraud_prediction;
    const transactionType = fraudPrediction === 1 ? "flagged" : "completed";

    // Perform transaction atomically
    const transaction = await prisma.$transaction(async (prisma) => {
      if (fraudPrediction === 0) {
        // Only process money transfer if transaction is safe
        await prisma.user.update({
          where: { phoneNumber: senderPhone },
          data: { balance: { decrement: Number(amount) } },
        });

        await prisma.user.update({
          where: { phoneNumber: receiverPhone },
          data: { balance: { increment: Number(amount) } },
        });
      }

      return await prisma.transaction.create({
        data: {
          receiverId: receiver.id,
          amount: Number(amount),
          transactionTime: new Date(),
          userId: sender.id,
          risk: parseFloat(fraudProbability),
          type: transactionType,
        },
      });
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, `Transaction ${transactionType} successfully`, {
          ...transaction,
          fraud_probability: fraudProbability,
        })
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
  