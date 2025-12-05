import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const TicketByUserPending=async(req,res)=>{
try {
    const userId=req.user.id;
    const tickets=await prisma.ticket.findMany({
        where:{userId,status:"PENDING"},
        include:{busSchedule:true}
    })
    if(tickets.length===0){
        return res.status(404).json({message:"No pending tickets found"})
    }
    res.status(200).json({data: tickets});
} catch (error) {
    res.status(500).json({message:"Failed to fetch tickets"})
}
}
export const TicketByUserPast=async(req,res)=>{
    try {
        const userId=req.user.id;
        const tickets=await prisma.ticket.findMany({
            where:{userId,status:"COMPLETED"},
            include:{busSchedule:true}
        })
        if(tickets.length===0){
            return res.status(404).json({message:"No past tickets found"})
        }
        res.status(200).json({data: tickets});
    } catch (error) {
        res.status(500).json({message:"Failed to fetch tickets"})
    }
}
export const getTicketDetails=async(req,res)=>{
    try {
        
        const ticketId=parseInt(req.params.id);
        const ticket=await prisma.ticket.findUnique({
            where:{id:ticketId},
            include:{
                booking:{
                    include:{
                        schedule:{
                            include:{
                                bus:{
                                    include:{
                                        route:true
                                    }
                                }
                            }
                        }
                    }
                }
            }

        })
        if(!ticket){
            return res.status(404).json({message:"Ticket not found"})
        }
        res.status(200).json({data: ticket});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to fetch ticket details"})
    }
}
export const getTicket = async (req, res) => {
  const userId = req.user?.id;
  const { type } = req.query;

  let dateFilter = {};

  if (type === "pass") {
    dateFilter = { lt: dayjs().toDate() };
  } else {
    dateFilter = { gte: dayjs().toDate() };
  }

  const tickets = await prisma.ticket.findMany({
    where: {
      issuedAt: dateFilter,
      booking: {
        userId: userId    
      }
    },
    include: {
      booking: {
        select: {
          paymentStatus: true,
          bookingStatus: true
        }
      }
    }
  });

  if (!tickets || tickets.length === 0) {
    return res.status(404).json({ message: "No tickets found" });
  }

  return res.status(200).json({
    data: tickets,
  });
};
