import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await prisma.busSchedule.findMany({ include: { bus: true } });
    res.status(200).json({data: schedules});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch schedules" });
  }
};

export const getSchedule = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const schedule = await prisma.busSchedule.findUnique({ where: { id }, include: { bus: true } });
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json({data: schedule});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch schedule" });
  }
};

export const createSchedule = async (req, res) => {
  const { busId, departureTime, arrivalTime, price } = req.body;
  try {
    const schedule = await prisma.busSchedule.create({
      data: { busId, departureTime: new Date(departureTime), arrivalTime: new Date(arrivalTime), price },
    });
    res.status(200).json({data: schedule});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create schedule" });
  }
};

export const updateSchedule = async (req, res) => {
  const id = parseInt(req.params.id);
  const { busId, departureTime, arrivalTime, price } = req.body;
  try {
    const schedule = await prisma.busSchedule.update({
      where: { id },
      data: { busId, departureTime: new Date(departureTime), arrivalTime: new Date(arrivalTime), price },
    });
    res.status(200).json({data: schedule});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update schedule" });
  }
};

export const deleteSchedule = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.busSchedule.delete({ where: { id } });
    res.status(200).json({data: { message: "Schedule deleted" }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete schedule" });
  }
};
