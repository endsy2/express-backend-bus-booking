import { PrismaClient } from "@prisma/client";


const prisma=new PrismaClient();

export const busSeatAndLayout = async (req, res) => {
  try {
    const scheduleId = parseInt(req.query.scheduleId);
    const busId = parseInt(req.query.busId);

    
    
    const busLayout = await prisma.bus.findUnique({
      where: { id: busId },
      select: {
        id: true,
        busNumber: true,
        layout: true
      }
    });

    if (!busLayout) {
      return res.status(404).json({ message: "Bus not found" });
    }

  const seats = await prisma.seat.findMany({
  where: {
    bus: {
      schedules: {
        some: {
          id: scheduleId,
        },
      },
    },
  },
  select: {
    id: true,
    seatNumber: true,
    seatType: true,
    bookingSeats: {
      where: {
        booking: {
          scheduleId: scheduleId,
          bookingStatus: "CONFIRMED",
        },
      },
      select: {
        id: true,
      },
    },
  },
});


const result = seats.map(seat => ({
  id: seat.id,
  seatNumber: seat.seatNumber,
  seatType: seat.seatType,
  status: seat.bookingSeats.length > 0 ? "BOOKED" : "AVAILABLE",
}));
    
   return res.status(200).json({data:result});

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


