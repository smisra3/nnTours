const express = require('express');
const app = express();

const path = require('path');
const busboy = require('busboy');
const fs = require('fs');
var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer();

const port = 5500;

const options = {
  root: path.join(__dirname, ''),
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  },
};

let currentTourName = '';
let currentRoomType = '';

app.get('/upload', (req, res) => res.sendFile('/templates/upload.html', options));

app.post('/upload', (req, res) => {
  const bb = busboy({ headers: req.headers });
  bb.on('file', (name, file, info) => {
    const saveTo = path.join(__dirname, 'assets', 'images', currentTourName, currentRoomType, name);
    file.pipe(fs.createWriteStream(saveTo));
  });
  bb.on('field', (name, val, info) => {
    var dir = `./assets/images/${val}`;
    if (name === 'Tour Name') {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        currentTourName = val;
      }
    }
    if (name === 'Room type') {
      var dir = `./assets/images/${currentTourName}/${val}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        currentRoomType = val;
      }
    }
    
  });
  bb.on('close', () => {
    res.writeHead(200, { 'Connection': 'close' });
    res.end(`That's all folks!`);
  });
  bb.on('error', (error) => {
    console.log('error in uploading file -> ', error);
  });
  req.pipe(bb);
  return;
});

app.get('/init', (req, res) => {
  res.sendFile('/canvases/init.html', options);
});

app.get('/simple-room', (req, res) => {
  res.sendFile('canvases/simpleRoom.html', options);
});

app.get('/js/:name', (req, res) => {
  res.sendFile(`/assets/js/${req.params.name}`, options);
});

app.get('/:name', (req, res) => {
  res.sendFile(`/assets/images/${req.params.name}`, options);
});

app.get('/', (req, res) => {
  res.sendFile('index.html', options);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
