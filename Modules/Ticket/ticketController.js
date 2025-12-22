import { Router } from "express";
import { getTicket,getTicketDetails } from "./ticketService.js";

const ticketRouter = Router();

ticketRouter.get('/getTicket',getTicket)
ticketRouter.get('/:id',getTicketDetails)

export default ticketRouter;