import { Router } from "express";
import { getAllRoutes, getAllBuses, getRoute, createRoute, updateRoute, deleteRoute } from "./RouteService.js";

const routeRoute = Router();

routeRoute.post('/createRoute', createRoute);//testing
routeRoute.get('/', getAllRoutes);
routeRoute.get('/:id', getRoute);
routeRoute.put('/update/:id', updateRoute);//testing
routeRoute.delete('/delete/:id', deleteRoute);//testing

export default routeRoute;