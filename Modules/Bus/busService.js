import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getBusLayoutWithSeats = async (req, res) => {
  try {
    const { busId } = req.params;

    // 1. Fetch bus and layout
    const bus = await prisma.bus.findUnique({
      where: { id: parseInt(busId) },
      include: {
        layout: true, // BusLayout
        seats: true,  // All seats of this bus
      },
    });

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.status(200).json({data: {
      layout: bus.layout?.layout || [], // JSON layout array
      seats: bus.seats.map(seat => ({
        id: seat.id,
        seatNumber: seat.seatNumber,
        price: seat.price,
        status: seat.status,
        positionLabel: seat.positionLabel,
      })),
    }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bus layout" });
  }
};

export const getbusdestandtime = async (req, res) => {
try {
const { origin, destination,departureTime,returnTime } = req.body;
const buses=await prisma.bus.findMany({
  where: {
    route: {
      origin: origin,
      destination: destination,
    },
    schedules: {
      some: {
        departureTime: {
          gte: new Date(departureTime),
          lte: new Date(returnTime)
        }
      }
    }
  },
  include: { route: true, schedules: true, layout: true }
});
res.status(200).json({data: buses});
} catch (error) {
  res.status(500).json({ message: "Failed to fetch bus with time" });
}
}


export const getAllBuses = async (req, res) => {
    try {
          const buses = await prisma.bus.findMany({ include: { route: true, schedules: true, layout: true ,seats:true} });
        res.status(200).json({data: buses});
    } catch (error) {
      console.error("Error fetching buses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};


export const getBus = async (req, res) => {
 try {
    const id = parseInt(req.params.id);
    const bus = await prisma.bus.findUnique({ 
    where: { id }, 
    include: {  seats:true, route: true, schedules: true, layout: true } 
  });
  if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.status(200).json({data: bus});
 } catch (error) {
   console.error("Error fetching bus:", error);
   res.status(500).json({ error: "Internal server error" });
 }
};

export const createBus = async (req, res) => {
  try {
    const { busNumber, busType, totalSeats, operatorName, origin, destination, layout } = req.body;

    // 1. Find or create the route
    let route = await prisma.busRoute.findFirst({ where: { origin, destination } });
    if (!route) {
      route = await prisma.busRoute.create({ data: { origin, destination } });
    }

    // 2. Create the bus
    const bus = await prisma.bus.create({
      data: {
        busNumber,
        busType,
        totalSeats,
        operatorName,
        routeId: route.id,
      },
    });

    // 3. Create bus layout (JSON with seat info)
    // layout example: [["1A","1B","1C"],["2A","2B","2C"],["3A",null,"3C"]]
    if (layout && Array.isArray(layout)) {
      await prisma.busLayout.create({
        data: {
          busId: bus.id,
          layout,
        },
      });

      // Optional: create seats in the Seat table automatically
      const seatData = [];
      layout.forEach((row, rowIndex) => {
        row.forEach((seatNumber, colIndex) => {
          if (seatNumber) {
            seatData.push({
              busId: bus.id,
              seatNumber,
              rowNumber: rowIndex + 1,
              colNumber: colIndex + 1,
              positionLabel: seatNumber,
              status: "AVAILABLE",
            });
          }
        });
      });

      if (seatData.length > 0) {
        await prisma.seat.createMany({ data: seatData });
      }
    }

    res.status(200).json({data: { bus, message: "Bus and layout created successfully" }});
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const routeId=await prisma.busRoute.findFirst({
            where:{origin:req.body.origin,destination:req.body.destination}
        }).then(route=>route.id)
        const { busNumber, busType, totalSeats, operatorName } = req.body;
        const bus = await prisma.bus.update({
            where: { id },
            data: { routeId, busNumber, busType, totalSeats, operatorName },
        });
        res.status(200).json({data: bus});
    } catch (error) {
        console.error("Error updating bus:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteBus = async (req, res) => {
  try {
      const id = parseInt(req.params.id);
      await prisma.bus.delete({ where: { id } });
      res.status(200).json({data: { message: "Bus deleted" }});
  } catch (error) {
      console.error("Error deleting bus:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

export const getBySchedule = async (req, res) => {
  try {
    const { departureDate, returnDate, destination } = req.body;
   
    // Validate input
    if (!departureDate || !destination) {
      return res.status(400).json({ 
        error: "departureDate and destination are required" 
      });
    }
    

    // Convert to UTC midnight
    const departureDateToDate = new Date(departureDate);
    departureDateToDate.setUTCHours(0, 0, 0, 0);
    var busBySchedule;
   
    // 1️⃣ Fetch bus schedules
    if(returnDate){
      const returnDateToDate=new Date(returnDate);
      returnDateToDate.setUTCHours(0,0,0,0)
      var busBySchedule = await prisma.busSchedule.findMany({
      where: {
        departureDate: {
          gte:departureDateToDate,
          lte:returnDateToDate
        },
        bus: {
          route: {
            destination: destination,
          },
        },
      },
      include: {
        bus: {
          include: {
            route: true,
          },
        },
      },
    });
    }
    else {
      // return res.json(returnDateToDate)
      
      var busBySchedule = await prisma.busSchedule.findMany({
      where: {
        departureDate: departureDateToDate,
        bus: {
          route: {
            destination: destination,
          },
        },
      },
      include: {
        bus: {
          include: {
            route: true,
          },
        },
      },
    });
    return res.status(200).json({data: busBySchedule})
    }
    
    
    // If no schedules found, return early
    if (busBySchedule.length === 0) {
      return res.status(200).json({data: {
        message: "No schedules found",
        data: [],
        count: 0
      }});
    }

    // 2️⃣ Get schedule IDs for batch query
    const scheduleIds = busBySchedule.map(s => s.id);

    // 3️⃣ Get booked/locked seats count per schedule (only one query needed!)
    const booked = await prisma.booking.groupBy({
      by: ['scheduleId'],
      where: {
        scheduleId: {
          in: scheduleIds
        },
        bookingStatus: {
          in: ['CONFIRMED']
        }
      },
      _count: {
        id: true
      }
    });

    // 4️⃣ Create lookup map for O(1) access
    const bookedSeatMap = new Map(
      booked.map(bs => [bs.scheduleId, bs._count.id])
    );

    // 5️⃣ Combine data efficiently
    const busesWithSeatCount = busBySchedule.map((schedule) => {
      const totalSeats = schedule.bus.totalSeats; // ✅ Use from Bus model
      const booked = bookedSeatMap.get(schedule.id) || 0;
      const available = totalSeats - booked;

      return {
        id: schedule.id,
        busId: schedule.busId,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        departureDate: schedule.departureDate,
        price: schedule.price,
        bus: {
          id: schedule.bus.id,
          busNumber: schedule.bus.busNumber,
          busType: schedule.bus.busType,
          totalSeats: totalSeats,
          availableSeats: available,
          bookedSeats: booked,
          route: {
            id: schedule.bus.route.id,
            origin: schedule.bus.route.origin,
            destination: schedule.bus.route.destination,
            distanceKm: schedule.bus.route.distanceKm,
            durationMinutes: schedule.bus.route.durationMinutes,
          }
        },
      };
    });

    // 6️⃣ Sort by available seats (most available first)
    busesWithSeatCount.sort((a, b) => b.bus.availableSeats - a.bus.availableSeats);

    return res.status(200).json({data: {
      message: "Successfully retrieved schedules",
      data: busesWithSeatCount,
      count: busesWithSeatCount.length,
      summary: {
        totalSchedules: busesWithSeatCount.length,
        totalAvailableSeats: busesWithSeatCount.reduce((sum, s) => sum + s.bus.availableSeats, 0),
        totalBookedSeats: busesWithSeatCount.reduce((sum, s) => sum + s.bus.bookedSeats, 0),
      }
    }});
  } catch (error) {
    console.error("Error get bus:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};