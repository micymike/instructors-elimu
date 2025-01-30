
const express = require('express');
const mongoose = require('mongoose');
const assessmentRoutes = require('./routes/assessmentRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', assessmentRoutes);

mongoose.connect('mongodb://localhost:27017/elimu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});