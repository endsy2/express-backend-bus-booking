import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//route
export const getAllRoutes = async (req,res) => {
  try {
    const routes = await prisma.busRoute.findMany();
    res.status(200).json({data: routes});
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const getAllBuses = async (req,res) => {
  try {
    const buses = await prisma.bus.findMany({
      include: { route: true }
    });
    res.status(200).json({data: buses});
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const getRoute = async (req, res) => {
  try {
     const id = parseInt(req.params.id);
  const route = await prisma.busRoute.findUnique({ 
    where: { id }, 
    include: { buses: true } 
  });
  if (!route) return res.status(404).json({ message: "Route not found" });
  res.status(200).json({data: route});
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
 
};

export const createRoute = async (req, res) => {
  try {
     const { origin, destination, distanceKm, durationMinutes } = req.body;
  const route = await prisma.busRoute.create({
    data: { origin, destination, distanceKm, durationMinutes },
  });
  res.status(200).json({data: route});
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { origin, destination, distanceKm, durationMinutes } = req.body;
    const route = await prisma.busRoute.update({
    where: { id },
    data: { origin, destination, distanceKm, durationMinutes },
  });
  res.status(200).json({data: route});
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.busRoute.delete({ where: { id } });
    res.status(200).json({data: { message: "Route deleted" }});
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
 
};

