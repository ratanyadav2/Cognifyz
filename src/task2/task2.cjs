const cors = require("cors");
const express = require("express");
const mongoClient = require("mongodb").MongoClient;

const conString = "mongodb://127.0.0.1:27017";
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const tempUserStorage = [];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/users', (req, res) => {
  const { userid, password, email } = req.body;

  if (!userid || userid.trim() === "") {
    return res.status(400).send("User ID required");
  }
  if (!password || password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters long");
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  const user = { userid, password, email };

  tempUserStorage.push(user);

  mongoClient.connect(conString)
    .then(clientObject => {
      const database = clientObject.db("cognifyingDB");
      return database.collection("users").insertOne(user);
    })
    .then(() => {
      console.log("User Registered and Temporarily Stored");
      res.status(200).send("User Registered Successfully");
    })
    .catch(err => {
      console.error("Error:", err);
      res.status(500).send("Server Error");
    });
});


app.listen(4040, () => {
  console.log(`Server Started http://127.0.0.1:4040`);
});
