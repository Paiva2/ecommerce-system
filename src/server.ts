import app from "./app"

const definePort = process.env.NODE_ENV === "test" ? 0 : 3000

const server = app.listen(definePort, () => {
  console.log("Server running")
})

export default server
