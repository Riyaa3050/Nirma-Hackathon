import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import prisma from "../utils/prismClient.js";

export const Do_transaction = async (req, res) => {
    try {
        const { receiverId, amount } = req.body;
        const senderId = req.user.id; // Assuming authenticated user info is stored in `req.user`

        // Validate input
        if (!receiverId || !amount) {
            return res.status(400).json(new ApiError(400, "Receiver ID and amount are required"));
        }

        if (senderId === receiverId) {
            return res.status(400).json(new ApiError(400, "Sender and Receiver cannot be the same"));
        }

        if (amount <= 0) {
            return res.status(400).json(new ApiError(400, "Amount must be greater than zero"));
        }

        // Fetch sender and receiver details in a single query
        const [sender, receiver] = await Promise.all([
            prisma.user.findUnique({ where: { id: senderId } }),
            prisma.user.findUnique({ where: { id: receiverId } })
        ]);

        if (!sender) return res.status(404).json(new ApiError(404, "Sender not found"));
        if (!receiver) return res.status(404).json(new ApiError(404, "Receiver not found"));

        // Check if sender has enough balance
        if (sender.balance < amount) {
            return res.status(400).json(new ApiError(400, "Insufficient balance"));
        }

        // Perform transaction in a database transaction to maintain atomicity
        const transaction = await prisma.$transaction(async (prisma) => {
            // Deduct amount from sender
            await prisma.user.update({
                where: { id: senderId },
                data: { balance: { decrement: amount } }
            });

            // Add amount to receiver
            await prisma.user.update({
                where: { id: receiverId },
                data: { balance: { increment: amount } }
            });

            // Store transaction record
            return await prisma.transaction.create({
                data: {
                    receiverId,
                    amount,
                    transactionTime: new Date(),
                    userId: senderId
                }
            });
        });

        return res.status(200).json(new ApiResponse(200, "Transaction completed successfully", transaction));

    } catch (err) {
        return res.status(500).json(new ApiError(500, err.message));
    }
};
