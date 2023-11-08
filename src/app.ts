import express, { Express } from "express"
import userRoutes from "./api/routes/userRoutes"
import bodyParser from "body-parser"
import cors from "cors"
import cookieParser from "cookie-parser"
import storeRoutes from "./api/routes/storeRoutes"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "../swagger.json"
import multer from "multer"
import "dotenv/config"
import { serverAdapter } from "./lib/bullMQ/bullDashboardConfig"

const app: Express = express()

const upload = multer({ dest: "temp/" })

app.use("/ui", serverAdapter.getRouter())

app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json())
app.use(upload.single("file"))
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

userRoutes(app)
storeRoutes(app)

export default app
