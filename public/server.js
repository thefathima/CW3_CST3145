// Importing required modules
const express = require('express') //imports the Express.js module, allowing you to create an Express application
const path = require("path"); // Import the path module for working with file paths

//Create an Express.js instance:
const app = express()

//config Express.js
// Middleware to parse incoming JSON requests
app.use(express.json()) // This middleware allows Express to automatically parse JSON request bodies

//Set the port number (3000) for the server to listen on
app.set('port', 3000)

// Middleware for handling CORS (Cross-Origin Resource Sharing) headers
app.use((req, res, next) => {

    // Set the value of the Access-Control-Allow-Origin header to allow requests from ANY origin
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Allow credentials to be sent with cross-origin requests
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Specify the allowed HTTP methods for cross-origin requests
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");

    // Specify the allowed headers for cross-origin requests
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    // This function passes control to the next middleware function in the stack
    next(); // This function passes control to the next middleware function in the stack

})
///logger middleware : logs all the requests, post an order (logs that), lessons (logs that) (log it and bring to server)
app.use(function (req, res, next) { 
    console.log("In comes a " + req.method + " to " + req.url);
    //eg: In comes a GET to collections/lessons
    next();
});

// Static file middleware for serving images (as per req or Postman)
const imagePath = path.resolve(__dirname, "images");
app.use('/images', express.static(imagePath));

// Custom middleware for handling non-existent images only when the path starts with "/images"
app.get('/images', (req, res, next) => {
    // Check if the file exists
    const filePath = path.join(imagePath, req.url);

    if (!require('fs').existsSync(filePath)) { //checks if file exists in filePath
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("Image not found");
    } else {
        // If the file exists, continue to the next middleware
        next();
    }
});

//link to my database
const MongoClient = require('mongodb').MongoClient

let db;
MongoClient.connect('mongodb+srv://fa1113:Xterra12345@cluster0.70nbtis.mongodb.net', (err, client) => { //this is the connection link
    db = client.db('cw2_db') //this is the name of the database from MongoDB Compass software
})

//for an empty GET request if I put only the AWS link it will say the below in quotes
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g.,/collection/lessons')
}) 


/////////////////////////////////////////////////////////////////////////////////////////
//creating parameter which is collectionName, define parameter so that u can use it for look for other requests
// (request object): Contains information about the incoming HTTP request.
// (response object): Allows you to send back an HTTP response to the client.
app.param('collectionName', (req, res, next, collectionName) => { // 4 parameters
    req.collection = db.collection(collectionName)
    return next()
})

//in the GET request - it takes the response and puts it into an array 
//this array is sent back to my front-end (response), the e is for an error - to check if I get an error
//http://cst3145-cw2-env.eba-qvjju2fi.eu-west-2.elasticbeanstalk.com/collection/lessons put this in edge - this is the array
//http://cst3145-cw2-env.eba-qvjju2fi.eu-west-2.elasticbeanstalk.com/collection/orders put this in edge - this is the array
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e) //e is error
        res.send(results)
    })
})

//for posting orders, takes data from the front-end and sends it to the mongodb database - orders collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e) //e is error
        res.send(results.ops)
    })
})

//to get the Mongodb ID from the database
//eg : http://cst3145-cw2-env.eba-qvjju2fi.eu-west-2.elasticbeanstalk.com/collection/lessons/65be1d24742dfae4818d7b41
const ObjectID = require('mongodb').ObjectID;
//returns everything inside that object from that object ID (ObjectID u get from Mongodb)
app.get('/collection/:collectionName/:id', (req, res, next) => {
    //searches for id in the collection and then returns the result in an array called result
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})

//this peice of code is to update anything inside products so eg: price u can just update it using this code
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update( //performs an update operation on the MongoDB collection
        { _id: new ObjectID(req.params.id) },
        { $set: req.body },
        { safe: true, multi: false },
        (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'sucess' } : { msg: 'error' })
        }
    )
})

//GET request for the search query 
//K is what I type on the search bar
app.get('/collection/:collectionName/search/:k', (req, res) => {
    var key_1 = req.params.k.toLowerCase();
    console.log("Searched term: " + key_1);

    //send a request to collection to FIND if searchQuery input is in either name or location in the mongodb collection
    req.collection.find(
        {
            $or: [
                { name: { $regex: new RegExp(key_1, "i") } },
            {location: {$regex: new RegExp(key_1, "i")}}]
        })

        //the response is sent back as an array from mongodb
        .toArray((e, results) => {
            if (e) return console.log(e) //if there's an error it will show an error on the console
            res.send(results); //else it will send results as a response to my front-end
        });
});

const port = process.env.PORT || 3000 //start the port
app.listen(port) 
