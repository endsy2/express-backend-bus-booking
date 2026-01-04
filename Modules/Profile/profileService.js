import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();


export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await prisma.user.findUnique({
      where: { id: userId }
    })
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }
    res.status(200).json({ data: profile })
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" })
  }
}
  export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID missing" });
    }

    const { fullName, email, phone } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: "fullName, email, and phone are required" });
    }

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Check if phone is already taken by another user
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone }
      });
      if (existingPhone && existingPhone.id !== userId) {
        return res.status(400).json({ error: "Phone number already in use" });
      }
    }

    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data: { fullName, email, phone }
    });

    return res.status(200).json({
      data: {
        message: "Profile updated successfully",
        profile: updatedProfile
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      error: "Failed to update profile",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

