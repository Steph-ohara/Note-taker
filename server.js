const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

const allNotes = require('./Develop/db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

module.exports = function(app) {
    
    app.get('/notes', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/notes.html'));
    });
  
    app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  };

function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './Develop/db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', function(req, res) {
      
    const deleteNote = req.params.id;
    console.log(deleteNote);

    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err;

      
      dbData = JSON.parse(data);
      
      for (let i = 0; i < dbData.length; i++) {
        if (dbData[i].id === Number(deleteNote)) {
          dbData.splice([i], 1);
        }
      }
      console.log(dbData);
      stringData = JSON.stringify(dbData);

      fs.writeFile('./db/db.json', stringData, (err, data) => {
        if (err) throw err;
      });
    });

          
    res.status(204).send();
});
};

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});