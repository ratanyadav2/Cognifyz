// import libraries 

const cors = require("cors");
const express = require("express");
const mongoClient = require("mongodb").MongoClient;

// Create connection string and app

const conString = "mongodb://127.0.0.1:27017";

const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Create API end points

app.post('/users', (req, res)=>{

        var user = {
            userid: req.body.userid,
            password: req.body.password,
            email: req.body.email
        };

        mongoClient.connect(conString).then(clientObject=>{

            var database = clientObject.db("cognifyingDB");

            database.collection("users").insertOne(user).then(()=>{
                 console.log('User Registered');
                 res.send();
            });
        });
});


app.listen(4040);
console.log(`Server Started http://127.0.0.1:4040`);
