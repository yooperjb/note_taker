const fs = require('fs'); // we need this in order to write to the json file
const path = require('path'); // used for working with file and directory paths
const express = require('express');
const PORT = process.env.PORT || 3001;
const notes = require('./db/db'); //require data

// instantiate the server
const app = express();

// This is the necessary middlware methods executed by Express.js server that our requests pass through before getting to the intended endpoint. Both the below are required for servers that accept POST data
// Takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object
app.use(express.urlencoded({ extended: true }));
// Takes incoming POST data in the form of JSON and parses into req.body JavaScript object
app.use(express.json());

// not sure if this is needed or not
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title){
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    // return filtered results
    return filteredResults;
}

// get note by the id
function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
};

// create new note from the POST body to the note array
function createNewNote(body, notesArray) {
    
    // get data response from POST as body
    const note = body;
    // push new note to notes array
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );

    return note;
};

// validate POST data
function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
};

// route to data. First argument is string of route client has to fetch from. Second arg is callback that will execute everytime that route is accesses with GET request. 
app.get('/api/notes', (req, res) => {
    
    let results = notes;
    //console.log("req.body is: ", typeof req.body);
    //console.log(req.body);

    // if query parameter property used filter results (req.query looks for any query after the ? in the URL)
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // respond with notes json file
    res.json(results);
});

// GET route for parameter property - id
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result){
       res.json(result); 
    } else {
        res.sendStatus(404);
    }
});


// POST route that accepts data stored server-side
app.post('/api/notes', (req, res) => {

    // create a unique ID to add to each new note using Math.max and spread operator. req.body is the data that is received from POST
    req.body.id = (Math.max(...notes.map(note => note.id)) +1 ).toString();
    console.log(req.body);

    // if any data in req.body is incorrect, send 400 error back
    if (!validateNote(req.body)) {
        res.status(400).send("The note is not properly formatted.");
    } else {
        // if validates add note to db.json file
        const note = createNewNote(req.body, notes);
        res.json(note);
    }   
});

// this makes the server listen
app.listen(PORT, () => {
    console.log(`API server now on ${PORT}!`);
});



