import express from "express"
import cors from "cors"

const app = express();
app.use(cors())
app.use(express.json())

const usersDB = [
  {name: "Anna"}, 
  {name: "Ben"}, 
  {name: "Clara"},
  {name: "David"}, 
  {name: "Emma"}, 
  {name: "Finn"}, 
  {name: "Grace"}, 
  {name: "Henry"}, 
  {name: "Isla"}, 
  {name: "Jack"},
]

app.get("/", (req, res) => {
  res.send("Hello, server")
})

app.listen(4000, () => {
  console.log(`Server is running port=${4000}"`);
})

app.get("/short-polling", (req, res) => {
  const { last } = req.query
  const fetchUsers = usersDB.slice(last, usersDB.length);

  res.status(200).json({ users: fetchUsers, last: usersDB.length })
})

export default app;

