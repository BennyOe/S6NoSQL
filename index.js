const redis = require("redis"); // redis in memory db
const redisClient = redis.createClient(); // redis client

const { MongoClient } = require("mongodb");
const mongoURI = "mongodb://localhost:27017";
const mongoClient = new MongoClient(mongoURI);

// Connect the client to the server
mongoClient.connect();
// Establish and verify connection
mongoClient.db("db").command({ ping: 1 });
console.log("Connected successfully to mongo server");

const mongoDatabae = mongoClient.db("db");
const plzCollection = mongoDatabae.collection("plz");

const express = require("express"); // REST module
const router = express.Router(); //
const app = express(); // middleware for parsing json

const fs = require("fs"); // nodejs files module
const path = require("path"); // path module for working with file and directory paths
const readline = require("readline"); // read line module
const { log } = require("console");

const PORT = 8080;

//middleware
app.use(express.json()); // parse incoming json in the body
app.use(express.static(__dirname)); // serves the static content
app.use("/", router);

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`)); // setting up the server

// sends the index.html file to the browser
router.get("/", function (_req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

// GET method for redis plz
app.get(`/redis/plz`, (req, res) => {
    redisClient.hgetall(req.query.plz, function (_err, obj) {
        console.log(obj);
        res.status(200).send({
            obj,
        });
    });
});

// GET method for redis city
app.get(`/redis/city`, (req, res) => {
    redisClient.smembers(req.query.city, function (_err, obj) {
        console.log(obj);
        res.status(200).send({
            obj,
        });
    });
});

// GET method for redis plz
app.get(`/plz`, (req, res) => {
    let query = { _id: req.query.plz };
    plzCollection.find(query).toArray(function (_err, obj) {
        console.log(obj);
        res.status(200).send({
            obj,
        });
    });
});

// GET method for redis city
app.get(`/city`, (req, res) => {
    let query = { city: req.query.city };
    plzCollection.find(query).toArray(function (_err, obj) {
        console.log(obj);
        res.status(200).send({
            obj,
        });
    });
});

// POST method
//app.post("/plz/:id", (req, res) => {
//const { id } = req.params;
//const { logo } = req.body;
//res.send({
//tshirt: `The id is ${id} and the logo is ${logo}`,
//});
//});

// reading the plz.data file and convert it to objects
const rl = readline.createInterface({
    input: fs.createReadStream("plz.data"),
    crlfDelay: Infinity,
});

function fillRedis() {
    rl.on("line", (line) => {
        try {
            const entry = JSON.parse(line);
            let id = entry._id;
            let city = entry.city;
            let loc = entry.loc;
            let pop = entry.pop;
            let state = entry.state;
            // writing the data to redis
            redisClient.hset(
                id,
                "city",
                city,
                "loc",
                JSON.stringify(loc),
                "pop",
                pop,
                "state",
                state
            );

            // writing another index with sets of ids mapped to cities to redis
            redisClient.sadd(city, id);
        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
    });
}

async function fillMongo() {
    plzCollection.deleteMany({}); // Deletes everything in the db
    let docs = fs.readFileSync("plz.data").toString().split("\n");
    console.log(docs.length);
    try {
        for (const line of docs) {
            if (line != "") {
                await plzCollection.insertOne(JSON.parse(line));
            }
        }
    } catch (err) {
        console.log("Error parsing JSON string:", err);
    }
}
fillRedis();
fillMongo();
