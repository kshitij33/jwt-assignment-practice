const express = require("express");
const jwt = require("jsonwebtoken");
const jwtPassword = "123456";

const app = express();

app.use(express.json());
const ALL_USERS = [
  {
    username: "kshitij@gmail.com",
    password: "123",
    name: "Kshitij Sawant",
  },
  {
    username: "peter@gmail.com",
    password: "123456",
    name: "Peter Parker",
  },
  {
    username: "josh@gmail.com",
    password: "1233",
    name: "Josh Jos",
  },
];

function userExists(username, password) {
  // write logic to return true or false if this user exists
  // in ALL_USERS array
  for (let index = 0; index < ALL_USERS.length; index++) {
    if (ALL_USERS[index].username === username && ALL_USERS[index].password === password) {
        return true;
    }
  }
  return false;
}

app.post("/signin", function (req, res) {
//   const username = req.params["username"];
//   const password = req.params["password"];
//   console.log(username);
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, jwtPassword);
  
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    // return a list of users other than this username
    res.json({
        users: ALL_USERS.filter(function(value){
            if (value.username === username) {
                return false;
            } else {
                return true;
            }
        })
    })
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.listen(3000)