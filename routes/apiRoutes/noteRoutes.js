const fs = require('fs'); // we need this in order to write to the json file
const path = require('path'); // used for working with file and directory paths
const router = require('express').Router();
const {filterByQuery, findById, createNewNote, validateNote} = require('../../lib/notes');
const notes = require('../../db/db.json'); //require json data

// route to data. First argument is string of route client has to fetch from. Second arg is callback that will execute everytime that route is accesses with GET request.
router.get('/notes', (req, res) => {
    
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
router.get('/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result){
       res.json(result); 
    } else {
        res.sendStatus(404);
    }
});

// POST route that accepts data stored server-side
router.post('/notes', (req, res) => {

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

// DELETE route for note id
router.delete('/notes/:id', (req, res) => {
    let deleteNote = req.params.id;

    for (let i = notes.length -1; i >= 0; i--) {
        if (deleteNote === notes[i].id) {
            notes.splice(i,1);
        }
    }
    fs.writeFileSync(
        path.join(__dirname, '../../db/db.json'),
        JSON.stringify(notes, null, 2)
    );
    res.json(notes)
});

module.exports = router;