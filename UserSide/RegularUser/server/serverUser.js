// server/serverUser.js
require('dotenv').config();
const express  = require('express');
const mongoose =   require('mongoose');
const path     = require('path');
const cors     = require('cors');

const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');
const expertRouter = require('./routes/expert');

// 1) Подключаемся к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

const app = express();

// 2) Middlewares
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// 3) API-маршруты
app.use('/api/auth', authRouter);
app.use('/api/login', authRouter);
app.use('/api/posts', postRouter);
app.use('/api/expert', expertRouter);
app.use('/api/fish-locations', postRouter);
app.use('/api/expert-fish-locations', expertRouter);

// 5) Корень сайта — страница логина
app.get('/', (req, res) => {
  res.sendFile(path.join('https://fishinmap.netlify.app/index.html'));
});

// 6) Запуск
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});