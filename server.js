const express = require('express');
const PORT = process.env.PORT || 3001;
const notes = require('./db/db'); //require data

// instantiate the server
const app = express();


// not sure if this is needed or not
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title){
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    // return filtered results
    return filteredResults;
}

// route to data. First argument is string of route client has to fetch from. Second arg is callback that will execute everytime that route is accesses with GET request. 
app.get('/api/notes', (req, res) => {
    
    let results = notes;

    // if query parameter used filter results
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // respond with notes json file
    res.json(results);
});


// this makes the server listen
app.listen(PORT, () => {
    console.log(`API server now on ${PORT}!`);
});

