// Main starting point of the application. Start with: node index.js. With nodemon installed: npm run dev (see package.json)
const express = require('express'); // Not using IE6 because version of node.js. IE6 uses import
const http = require('http'); // Native node library. Working very low level with http-request.
const bodyParser = require('body-parser'); // Parse incoming request.
const morgan = require('morgan'); // Logging framework. Logs incoming request
const app = express(); // Instance of Express
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth'); // Creates a new DB 'auth' inside mongodb

// App Setup (set up the application)
// morgan and bodyParser is middleware in Express. The .use is registrating middleware.
app.use(morgan('combined')); // Any incoming request is passed in to morgan.
app.use(bodyParser.json({ type: '*/*' })); // Parse incoming request as JSON
router(app);


// Server Setup (talk to the outside world)
const port = process.env.PORT || 3090; // Use the port stated in enviroment variable else use port 3090
const server = http.createServer(app); // create http-server knows how to recive request and send it to app.
server.listen(port);
console.log('Server listening on: ', port);
