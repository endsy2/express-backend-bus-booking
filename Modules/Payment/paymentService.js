
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// import {BakongKHQR, khqrData, IndividualInfo, MerchantInfo, SourceInfo} from "bakong-khqr";

// export const paymentService = async (req, res) => {
//   try {
//     const token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYmMwMTRkMTUzMDc4NGQyMiJ9LCJpYXQiOjE3NjEzODQ4NDQsImV4cCI6MTc2OTE2MDg0NH0.TtBUncqfJSVxYvjGfaLL7rS5a4_ui5ZZrAomeIIUlNs'
//     const KHQR = new BakongKHQR(token);

//     const optionalData = {
//     currency: khqrData.currency.khr, // optional: default value KHR
//     amount: 1000,
//     expirationTimestamp: Date.now() + (2 * 60 * 1000), // required if dynamic KHQR (eg. expired in 2 minutes)
//     merchantCategoryCode: "5999", // optional: default value 5999
//     };

//     const individualInfo = new IndividualInfo(
//       "chin_kongming@aclb",  // bakongAccountID
//       "CHIN KONG MING",       // merchantName
//       "PHNOM PENH",           // merchantCity
//       "011418390",            // merchantID
//       "ACLBKHPXXX",  
//       0,
//       1000
//       // optionalData
//     );

//     const response = KHQR.generateIndividual(individualInfo);
//     console.log("KHQR response:", response);
    
//     if (response.status.code !== 0) {
//       return res.status(400).json({ message: "KHQR generation failed", status: response.status });
//     }

//     return res.json({ message: "Payment Success", data: response.data });

//   } catch (err) {
//     console.error("Full error object:", err);
//     return res.status(500).json({ error: err.message || err });
//   }
// };
// export const verifyQrCode=async (req,res)=>{
// const {KHQRString} =req.body;
// const isKHQR = BakongKHQR.verify(KHQRString).isValid;
// return res.json({isKHQR});
// }
// export const decodeQrCode=async (req,res)=>{
//     const {KHQRString} =req.body;
//     const decodedData = BakongKHQR.decode(KHQRString);
//     return res.json({decodedData});
// }
// export const deeplinkQrCode=async (req,res)=>{
//     const {KHQRString} =req.body;
//     const deeplinkUrl = BakongKHQR.generateDeepLink(KHQRString);
//     return res.json({deeplinkUrl});
// }
// export const checkMD5=async (req,res)=>{
//     const {md5Hash} =req.body;
//     const isValid = BakongKHQR.(md5Hash);
//     return res.json({isValid});
// }
export const insertPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, transaction_id, status, paidAt } = req.body;
    console.log("here");
    
    // 1. Validate required fields (optional but recommended)
    if (!bookingId || !amount || !method || !transaction_id || !status || !paidAt) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Insert into database
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        method,
        transactionId: transaction_id,
        status,
        paidAt: new Date(paidAt) // ensure it's a Date object
      },
    });
    await prisma.booking.update({
      data:{
        paymentStatus:"PAID"
      },
      where:{
        id:bookingId
      }
    })
    await prisma.ticket.create({
      data:{
        bookingId:bookingId,
        issuedAt:new Date()
      }
    })

    // 3. Return success response
    return res.status(201).json({
      message: "Payment inserted successfully",
      payment,
    });
  } catch (error) {
    console.error("Insert payment error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};