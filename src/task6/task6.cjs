const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
}

// REGISTER
app.post("/register", async (req, res) => {
  const { userid, password, email } = req.body;

  if (!userid || !password || !email || !isValidEmail(email)) {
    return res.status(400).send("Invalid input");
  }

  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("cognifyingDB");

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({ userid, password: hashedPassword, email });

    res.status(200).send("User registered");
    client.close();
  } catch (err) {
    res.status(500).send("Registration failed");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  const { userid, password } = req.body;

  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("cognifyingDB");
    const user = await db.collection("users").findOne({ userid });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ userid: user.userid }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
    client.close();
  } catch (err) {
    res.status(500).send("Login error");
  }
});

// GET USERS (Protected)
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("cognifyingDB");

    const users = await db.collection("users").find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
    client.close();
  } catch (err) {
    res.status(500).send("Failed to fetch users");
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
