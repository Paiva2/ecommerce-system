import app from "./app"

const server = app.listen(3000, () => {
  console.log("Server running")
})

export default server
