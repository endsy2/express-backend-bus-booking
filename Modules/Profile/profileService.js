import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma=new PrismaClient();


export const getProfile=async(req,res)=>{
    try {
        const userId=req.user.id;
        const profile=await prisma.user.findUnique({
            where:{id:userId}
        })
        if(!profile){
            return res.status(404).json({error:"Profile not found"})
        }
        res.status(200).json({data: profile})
    } catch (error) {
        res.status(500).json({error:"Failed to fetch profile"})
    }
}
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID missing" });
    }

    const image = req.file ? req.file.path : null;
    const { fullname, phone, address } = req.body;

    const updatedProfile = await prisma.user.upsert({
      where: { id: userId },
      update: { fullname, phone, address, image },
      create: { id: userId, fullname, phone, address, image }, 
    });

    return res.status(200).json({data: { message: "Profile Updated", profile: updatedProfile }});
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Failed To Update Profile" });
  }
};

