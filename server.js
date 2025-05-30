import express from "express"
import cors from "cors"
import { EventEmitter }from "events"
import { WebSocketServer } from "ws";

const HTTP_PORT = 4000;
const PUSH_USER_EVENT = "push-user"
const WS_PORT = 2000;

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

const eventEmitter = new EventEmitter;

app.get("/", (req, res) => {
  res.send("Hello, server")
})

app.get("/short-polling", (req, res) => {
  const { last } = req.query


  const fetchUsers = usersDB.slice(last, usersDB.length);
  console.log(fetchUsers);
  console.log(last);

  res.status(200).json({ users: fetchUsers, last: usersDB.length })
})

app.get("/long-polling", (req, res) => {
  const { last } = req.query;  

  eventEmitter.once(PUSH_USER_EVENT, () => {
    const fetchUsers = usersDB.slice(last, usersDB.length);

    res.status(200).json({ users: fetchUsers, last: usersDB.length })
  })

})

app.listen(HTTP_PORT, () => {
  console.log(`Server is running port=${HTTP_PORT}"`);
})

const wss = new WebSocketServer({
  port: WS_PORT,
  }, () => {
    `ws server is running port=${WS_PORT}`
  }
)

wss.on("connection", (ws) => {
  let last = 0;
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const {lastUserIndex } = JSON.parse(data);
    
    last = lastUserIndex;
  })

  eventEmitter.on(PUSH_USER_EVENT, () => {
    const freshUsers = usersDB.slice(last, usersDB.length);
    last = usersDB.length;

    const data = JSON.stringify({ users: freshUsers, last});

    ws.send(data)
  })

})

// function pushUser() {
//   const delay = Math.floor(Math.random() * 6000);

//   setTimeout(() => {
//     const user = generateUser();
//     usersDB.push(user);
//     eventEmitter.emit(PUSH_USER_EVENT)
    

//     pushUser()
//   }, delay)
// }

// pushUser();

function generateUser() {
  const names = [
  "Anna", "Ben", "Clara", "David", "Emma", "Finn", "Grace", "Henry", "Isla", "Jack",
  "Kira", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Rose", "Sam", "Tina"
  ];
  const surnames = [
  "Adams", "Brown", "Clark", "Davis", "Evans", "Ford", "Green", "Hall", "Hill", "Jones",
  "King", "Lee", "Moore", "Nelson", "Parker", "Reed", "Smith", "Taylor", "White", "Young"
  ];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];

  return {
    name: randomName,
    surname: randomSurname,
  }
}

