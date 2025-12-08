import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const bookSeats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { scheduleId, seatIds, promoCode } = req.query;

    // 1. Check if seats exist and are available
    const seats = await prisma.seat.findMany({
      where: { id: { in: seatIds }, bus: { schedules: { some: { id: scheduleId } } } }
    });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({ message: 'Some seats are invalid for this schedule' });
    }

    const unavailableSeats = seats.filter(seat => seat.status !== 'AVAILABLE');
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ message: 'Some seats are already booked' });
    }

    // 2. Calculate total price
    let totalAmount = seats.reduce((sum, seat) => sum + (seat.price || 0), 0);
    let promoId = null;

    // 3. Apply promo if provided
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode } });
      if (!promo) return res.status(404).json({ message: 'Promo code not found' });
      if (promo.status !== 'ACTIVE') return res.status(400).json({ message: 'Promo is not active' });

      const now = new Date();
      if (promo.validFrom && promo.validFrom > now) return res.status(400).json({ message: 'Promo not active yet' });
      if (promo.validTo && promo.validTo < now) return res.status(400).json({ message: 'Promo expired' });
      if (promo.maxUses && promo.usedCount >= promo.maxUses) return res.status(400).json({ message: 'Promo limit reached' });

      if (promo.discountType === 'PERCENTAGE') {
        totalAmount -= (totalAmount * promo.discountValue / 100);
      } else {
        totalAmount -= promo.discountValue;
      }

      totalAmount = Math.max(totalAmount, 0); // prevent negative
      promoId = promo.id;
    }

    // 4. Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        scheduleId,
        totalAmount,
        promoId,
        bookingStatus: 'CONFIRMED',
        paymentStatus: 'PENDING',
      },
    });

    // 5. Create BookingSeats
    await prisma.bookingSeat.createMany({
      data: seatIds.map(seatId => ({
        bookingId: booking.id,
        seatId,
      })),
    });

    // 6. Update seat statuses
    await prisma.seat.updateMany({
      where: { id: { in: seatIds } },
      data: { status: 'BOOKED' },
    });

    // 7. Handle promo usage
    if (promoId) {
      await prisma.promoCode.update({
        where: { id: promoId },
        data: { usedCount: { increment: 1 } },
      });

      await prisma.promoUsage.create({
        data: {
          promoId,
          userId,
          bookingId: booking.id,
        },
      });
    }

    res.status(200).json({data: { message: 'Booking successful', booking }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // 1. Check booking exists
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { bookingSeats: true },
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.bookingStatus === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // 2. Release seats
    const seatIds = booking.bookingSeats.map(bs => bs.seatId);
    await prisma.seat.updateMany({
      where: { id: { in: seatIds } },
      data: { status: 'AVAILABLE' },
    });

    // 3. Update booking status
    await prisma.booking.update({
      where: { id: booking.id },
      data: { bookingStatus: 'CANCELLED', paymentStatus: 'FAILED' },
    });

    res.status(200).json({data: { message: 'Booking cancelled and seats released' }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};