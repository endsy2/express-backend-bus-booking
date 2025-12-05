import { PrismaClient } from "@prisma/client";


const prisma=new PrismaClient();

export const busSeatAndLayout = async (req, res) => {
  try {
    const { scheduleId, busId } = req.body;

    
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

    const busSeat = await prisma.seat.findMany({
      where: { busId: busId },
      select: {
        id: true,
        seatNumber: true,
        busId: true,
        bookingSeats: {
          where: {
            booking: {
              scheduleId: scheduleId,      
            }
          },
          select: {
            booking: {
              select: {
                bookingStatus: true
              }
            }
          }
        }
      }
    });

    // 3️⃣ Flatten and mark availability
    const seatsWithAvailability = busSeat.map(seat => ({
      id: seat.id,
      seatNumber: seat.seatNumber,
      busId: seat.busId,
      status: seat.bookingSeats.length > 0 ? "UNAVAILABLE" : "AVAILABLE"
    }));

    // 4️⃣ Combine into final response
    return res.status(200).json({data: {
      message: "Bus layout and seat info loaded successfully",
      layout: busLayout,
      seats: seatsWithAvailability
    }});

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


