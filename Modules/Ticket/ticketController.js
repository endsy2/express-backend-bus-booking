import { Router } from "express";
import { getTicketDetails } from "./ticketService.js";

const ticketRouter = Router();

ticketRouter.get('/:id',getTicketDetails)
ticketRouter.get('/getTicket',getTicket)

export default ticketRouter;