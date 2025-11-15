import { Router } from "express";
import { getAllSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule } from "./busScheduleService.js";
const busScheduleRoute=Router()
busScheduleRoute.get('/getallschedule', getAllSchedules);
busScheduleRoute.get('/:id', getSchedule);
busScheduleRoute.post('/', createSchedule);//test
busScheduleRoute.put('/:id', updateSchedule);//test
busScheduleRoute.delete('/:id', deleteSchedule);//test
export { busScheduleRoute };