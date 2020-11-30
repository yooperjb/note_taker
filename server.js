const express = require('express');
const PORT = process.env.PORT || 3001;
// these will read the index.js file in the directory
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// instantiate the server
const app = express();

// This is the necessary middlware methods executed by Express.js server that our requests pass through before getting to the intended endpoint. Both the below are required for servers that accept POST data
// Takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object
app.use(express.urlencoded({ extended: true }));
// Takes incoming POST data in the form of JSON and parses into req.body JavaScript object
app.use(express.json());
// Sets router paths
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// middleware to make public files available
app.use(express.static('public'));

// this makes the server listen
app.listen(PORT, () => {
    console.log(`API server now on ${PORT}!`);
});



