var path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('dist'));

console.log(__dirname);

console.log(`Your API key is ${process.env.API_KEY}`);

// Variables for url and api key
// You could call it aylienapi, or anything else
// var textapi = new aylien({
//     application_key: process.env.API_KEY
//   });


app.get('/', function (req, res) {
    // res.send("This is the server API page, you may access its services via the client app.");
    res.sendFile('dist/index.html');
});


// POST Route



// Designates what port the app will listen to for incoming requests
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


