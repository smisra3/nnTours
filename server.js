const express = require('express');
const app = express();

const path = require('path');
const busboy = require('busboy');
const fs = require('fs');
var bodyParser = require('body-parser');

var multer = require('multer');
var upload = multer();

const port = 5500;

const updateConfig = ({
  dir,
  currentRoomType = '',
  tourStart = '',
  filename,
  hotspot,
}) => {
  const data = fs.readFileSync(dir, 'utf8');
  let obj = JSON.parse(data);
  obj = {
    ...(obj || {}),
    metaInfo: {
      ...(obj.metaInfo || {}),
      [currentRoomType]: {
        images: [
          ...(((obj.metaInfo || {})[currentRoomType] || {}).images || [])
        ],
      },
    },
    tourStart: {
      ...(obj.tourStart || {}),
      tagName: tourStart || (obj.tourStart || {}).tagName || '',
    },
  };
  if (hotspot) {
    obj.metaInfo[hotspot.roomName].hotspot = {
      x: hotspot.x,
      y: hotspot.y,
      name: hotspot.name,
    }
  }
  if (filename && currentRoomType) {
    obj.metaInfo[currentRoomType].images.push(`http://localhost:5500/img/${currentTourName}/${currentRoomType}/${filename}`)
  }
  json = JSON.stringify(obj);
  fs.writeFileSync(dir, json, 'utf8');
  return true;
};

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

app.get('/start/tour/:tourName', (req, res) => {
  res.sendFile('/canvases/tour.html', options);
});

app.get('/tour/:tourName', (req, res) => {
  const dir = `./assets/images/${req.params.tourName}/config.json`;
  return res.sendFile(dir, options);
});

app.get('/hotspot', (req, res) => {
  const { roomName, tourName, x, y, name } = req.query;
  var dir = `./assets/images/${tourName}/config.json`;
  updateConfig({ dir, hotspot: { x, y, name, roomName, tourName, } });
  res.send('ok');
});

app.get('/upload', (req, res) => res.sendFile('/templates/upload.html', options))

app.post('/upload', (req, res) => {
  const bb = busboy({ headers: req.headers });

  bb.on('file', (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    const saveTo = path.join(__dirname, 'assets', 'images', currentTourName, currentRoomType, name);
    file.pipe(fs.createWriteStream(saveTo));
    const dir = `./assets/images/${currentTourName}/config.json`;
    console.log('config file exists? -> ', fs.existsSync(dir));
    if (!fs.existsSync(dir)) {
      console.log('creating config file for -> ', currentTourName);
      fs.writeFileSync(dir, JSON.stringify({ tourName: currentTourName, }));
    }
    console.log('Now updating config with file name -> ', filename)
    updateConfig({ dir, currentRoomType, filename, });
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

    if (name === 'Tour Start') {
      const dir = `./assets/images/${currentTourName}/config.json`;
      if (!fs.existsSync(dir)) {
        fs.writeFileSync(dir, JSON.stringify({ tourName: currentTourName, }));
      }
      updateConfig({ dir, tourStart: currentRoomType, currentRoomType, });
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

app.get('/img/:tourName/:roomName/:name', (req, res) => {
  res.sendFile(`/assets/images/${req.params.tourName}/${req.params.roomName}/${req.params.name}`, options);
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
