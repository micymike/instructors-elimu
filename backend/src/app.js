const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const courseGenerationRoutes = require('./routes/course-generation.routes');

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/courses', courseGenerationRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 