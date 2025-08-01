require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
    origin: 'https://688c4b6c8f943517f7d7236a--superlative-naiad-35a691.netlify.app',
    credentials: true
}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'AdminSide/client')));

const userRoutes = require('./server/routers/userrouter');
app.use('/api/users', userRoutes);

const postRoutes = require('./server/routers/postrouter');
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
