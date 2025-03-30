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

    const { receiverPhone, amount, currency, transactionType } = req.body;
    const senderPhone = req.user.phoneNumber;

    if (!receiverPhone || !amount || !currency || !transactionType) {
      return res
        .status(400)
        .json(new ApiError(400, "Receiver phone, amount, currency, and transaction type are required"));
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
      SenderID: senderPhone, 
      ReceiverID: receiverPhone, 
      Currency: currency, // Now coming from frontend
      TransactionType: transactionType, // Now coming from frontend
      Amount: amount,
      Timestamp: new Date().toISOString(),
    };

    // Call the ML model API
    const predictionResponse = await axios.post(
      "http://127.0.0.1:5000/predict", 
      transactionData
    );

    let fraudProbability = predictionResponse.data.fraud_probability;
    fraudProbability = (fraudProbability).toFixed(2);

    const fraudPrediction = predictionResponse.data.fraud_prediction;
    const transactionStatus = fraudPrediction === 1 ? "flagged" : "completed";
  
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
      
      return await prisma.transaction.create({
        data: {
          receiverId: receiverPhone, // Stored as phone number
          amount: Number(amount),
          transactionTime: new Date(),
          userId: sender.id, // Stored as phone number
          risk: parseFloat(fraudProbability),
          type: transactionStatus,
          transactionType: transactionType, // Now dynamic from frontend
          currency: currency, // Now dynamic from frontend
          reason: fraudPrediction === 1 ? predictionResponse.data.fraud_reason_descriptions: [], // Pass as an array
        },
      });
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, `Transaction ${transactionStatus} successfully`, {
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
  