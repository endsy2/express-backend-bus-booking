import { Router } from "express";
import { getAllBuses, getBus, createBus, updateBus, deleteBus,getBySchedule } from "./busService.js";

const busRoute = Router();
busRoute.get('/bySchedule/:destinationId',getBySchedule);
busRoute.get('/', getAllBuses);
busRoute.get('/:id', getBus);
busRoute.post('/createbus', createBus); //testing
busRoute.put('/:id', updateBus);//testing
busRoute.delete('/:id', deleteBus);//testing
// busRoute.get("/testing",getbusdestandtime)


export { busRoute };