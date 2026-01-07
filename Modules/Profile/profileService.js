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

    const { fullName, phone, email } = req.body;
    const image = req.file?.path;

    
    const data = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) data.email = email;
    if (image !== undefined) data.image = image;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const updatedProfile = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return res.status(200).json({
      message: "Profile updated",
      data: updatedProfile,ø
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    // User not found
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(500).json({ error: "Failed to update profile" });
  }
};


