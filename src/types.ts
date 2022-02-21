import {Request, Response} from "express";
//import {Session} from "express-session";
import {Connection} from "typeorm"

export type MyContext = {
  req: Request,
  res: Response;
  connection: Connection;
}