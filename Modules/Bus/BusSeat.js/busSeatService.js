import { PrismaClient } from "@prisma/client";


const prisma=new PrismaClient();

export const busSeatAndLayout=async (req,res)=>{
    const {scheduleId,busId}=req.body;
    const busLayout=await prisma.bus.findMany({
       where:{id:busId},
       include:{
        layout:true
       },
    })
    const busSeat=await prisma.seat.findMany({
        where:{busId:busId}
    })
    return res.json(busSeat)
}