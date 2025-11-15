import { Router } from "express";
import { getAllLayouts, getLayout, createLayout, updateLayout, deleteLayout } from "./busLayoutService.js";
const busLayoutRoute = Router();
busLayoutRoute.get('/getall/', getAllLayouts);
busLayoutRoute.get('/:id', getLayout);
busLayoutRoute.post('/', createLayout);
busLayoutRoute.put('/:id', updateLayout);//testing  
busLayoutRoute.delete('/:id', deleteLayout);//testing
export { busLayoutRoute };