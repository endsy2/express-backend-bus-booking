import { Router } from "express";
import { busSeatAndLayout } from "./busSeatService.js";

const busSeatRoute = Router();

busSeatRoute.get('/seatAndLayout',busSeatAndLayout)
export default busSeatRoute;
