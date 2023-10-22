import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import "dotenv/config"

export default function jwtCheck(
  req: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies["voucher-token"]

    if (!token) throw new Error()

    jwt.verify(token, process.env.SECRET_TOKEN)

    next()
  } catch {
    return response.status(403).send({ message: "Invalid token." })
  }
}
