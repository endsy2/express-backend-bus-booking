import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

export const TicketByUserPending = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await prisma.ticket.findMany({
      where: { userId, status: "PENDING" },
      include: { busSchedule: true }
    })
    if (tickets.length === 0) {
      return res.status(404).json({ message: "No pending tickets found" })
    }
    res.status(200).json({ data: tickets });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets" })
  }
}
export const TicketByUserPast = async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await prisma.ticket.findMany({
      where: { userId, status: "COMPLETED" },
      include: { busSchedule: true }
    })
    if (tickets.length === 0) {
      return res.status(404).json({ message: "No past tickets found" })
    }
    res.status(200).json({ data: tickets });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets" })
  }
}
export const getTicketDetails = async (req, res) => {
  try {

    const ticketId = Number(req.params.id);
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        booking: {
          include: {
            schedule: {
              include: {
                bus: {
                  include: {
                    route: true
                  }
                }
              }
            }
          }
        }
      }

    })
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }
    res.status(200).json({ data: ticket });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch ticket details" })
  }
}
export const getTicket = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { type } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 Date filter
    const dateFilter =
      type === "pass"
        ? { lt: dayjs().toDate() }
        : { gte: dayjs().toDate() };

    // 🔹 Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // 🔹 Get tickets
    const tickets = await prisma.ticket.findMany({
      where: {
        issuedAt: dateFilter,
        booking: {
          userId
        }
      },
      select: {
        id: true,
        issuedAt: true,
        booking: {
          select: {
            id: true,
            paymentStatus: true,
            bookingStatus: true,
            _count: {
              select: {
                bookingSeats: true
              }
            },
            schedule: {
              select: {
                bus: {
                  select: {
                    busType: true,
                    busNumber: true,
                    route: {
                      select: {
                        origin: true,
                        destination: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        issuedAt: "desc"
      }
    });

    // 🔹 Format response (rename seat count)
    const formattedTickets = tickets.map(ticket => {
      const { _count, ...booking } = ticket.booking;

      return {

        id: ticket.id,
        issuedAt: ticket.issuedAt,
        booking: {
          ...booking,
          seatCount: _count.bookingSeats
        }

      };
    });

    return res.status(200).json({
      data: {
        user,
        totalTickets: formattedTickets.length,
        data: formattedTickets
      }
    });

  } catch (error) {
    console.error("Get Ticket Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
