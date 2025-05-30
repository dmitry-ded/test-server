import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const usersDB = [
  { name: "Anna" },
  { name: "Ben" },
  { name: "Clara" },
  { name: "David" },
  { name: "Emma" },
  { name: "Finn" },
  { name: "Grace" },
  { name: "Henry" },
  { name: "Isla" },
  { name: "Jack" },
];

app.get("/short-polling", (req, res) => {
  const { last } = req.query;
  const fetchUsers = usersDB.slice(last, usersDB.length);
  res.status(200).json({ users: fetchUsers, last: usersDB.length });
});

app.get("/", (req, res) => {
  res.send("Hello, server");
});

app.post("/add-user", (req, res) => {
  const { name } = req.body;

  if(!name) {
    return res.status(404).json({ error: "Укажите имя!"})
  }

  usersDB.push({ name });

  res.status(201).json({ users: usersDB, last: usersDB.length })
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;