const redis = require("redis"); // redis in memory db
const client = redis.createClient(); // redis client
const fs = require("fs"); // nodejs files module
const readline = require("readline"); // read line module
const express = require("express"); // REST module
const path = require("path"); // path module
const router = express.Router(); //
const app = express(); // middleware for parsing json
const PORT = 8080;

//middleware
app.use(express.json()); // set the middleware to parse incoming json in the body
app.use(express.static(__dirname)); // serves the static content
app.use("/", router);

app.listen(PORT, () => console.log(`it's alive on http://localhost:${PORT}`)); // setting up the server

// sends the index.html file to the browser
router.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

// GET method
app.get(`/plz`, (req, res) => {
    client.hgetall(req.query.plz, function (err, obj) {
        console.log(obj);
        res.status(200).send({
            obj,
        });
    });
});

// POST method
app.post("/tshirt/:id", (req, res) => {
    const { id } = req.params;
    const { logo } = req.body;

    res.send({
        tshirt: `The id is ${id} and the logo is ${logo}`,
    });
});

// reading the plz.data file and convert it to objects
const rl = readline.createInterface({
    input: fs.createReadStream("plz.data"),
    crlfDelay: Infinity,
});

rl.on("line", (line) => {
    try {
        const entry = JSON.parse(line);
        let id = entry._id;
        let city = entry.city;
        let loc = entry.loc;
        let pop = entry.pop;
        let state = entry.state;
        console.log("PLZ is: ", id);
        client.hset(
            "id" + id,
            "city",
            city,
            "loc",
            JSON.stringify(loc),
            "pop",
            pop,
            "state",
            state
        );
        //client.zadd("cityindex", city, id);
    } catch (err) {
        console.log("Error parsing JSON string:", err);
    }
});
