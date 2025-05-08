const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/dashboardData', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const RecordSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});
const Record = mongoose.model('Record', RecordSchema);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  file.mimetype === 'text/csv'
    ? cb(null, true)
    : cb(new Error('Only CSV files allowed'), false);
};
const upload = multer({ storage, fileFilter });

// Upload route
app.post('/upload', upload.single('csvFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await Record.deleteMany();
        await Record.insertMany(results);
        res.status(200).json({ message: 'Data stored in DB', count: results.length });
      } catch (err) {
        res.status(500).json({ message: 'DB error', error: err.message });
      }
    });
});

// Serve data for frontend
app.get('/data', async (req, res) => {
  const records = await Record.find();
  res.status(200).json(records);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));