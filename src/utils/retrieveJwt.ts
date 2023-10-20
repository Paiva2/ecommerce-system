import jwt from "jsonwebtoken"
import "dotenv/config"

export default function retrieveJwt(token: string) {
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)

  return decodedToken
}
