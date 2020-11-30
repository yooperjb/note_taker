const fs = require("fs");
const path = require("path");

// not sure if this is needed or not
function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title){
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    // return filtered results
    return filteredResults;
};

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
        path.join(__dirname, '../db/db.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewNote,
    validateNote
};