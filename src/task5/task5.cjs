const cors = require("cors");
const express = require("express");
const { MongoClient } = require("mongodb");

const conString = "mongodb://127.0.0.1:27017";
const app = express();
const PORT = 4040;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET all users
app.get('/users', async (req, res) => {
  try {
    const client = await MongoClient.connect(conString);
    const db = client.db("cognifyingDB");
    const users = await db.collection("users").find({}).toArray();
    res.status(200).send(users);
    client.close();
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server Error");
  }
});

// POST register new user
app.post('/users', async (req, res) => {
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

  const newUser = { userid, password, email };

  try {
    const client = await MongoClient.connect(conString);
    const db = client.db("cognifyingDB");

    await db.collection("users").insertOne(newUser);

    res.status(200).send("User Registered Successfully");
    client.close();
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).send("Server Error");
  }
});

// DELETE user by userid
app.delete('/delete/:userid', async (req, res) => {
  const userid = req.params.userid;

  try {
    const client = await MongoClient.connect(conString);
    const db = client.db("cognifyingDB");

    const result = await db.collection("users").deleteOne({ userid: userid });

    if (result.deletedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
    client.close();
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Server Error");
  }
});

// PUT update user by userid
app.put('/edit-register/:userid', async (req, res) => {
  const userid = req.params.userid;

  const updatedUser = {
    userid: req.body.userid,
    email: req.body.email
  };

  try {
    const client = await MongoClient.connect(conString);
    const db = client.db("cognifyingDB");

    const result = await db.collection("users").updateOne(
      { userid: userid },
      { $set: updatedUser }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User updated successfully");
    client.close();
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Server Error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
});
