const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const seedGuides = require('./seeds/seedGuides');
const questionRoutes = require('./routes/questions');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const plannerRoutes = require('./routes/planner');
const safetyRoutes = require('./routes/safety');
const yatraShayakRoutes = require('./routes/yatraShayak');
const guideRegistrationRoutes = require('./routes/guideRegistration');
const itineraryRoutes = require('./routes/itineraries');
const aiRoutes = require('./routes/ai');
const profileRoutes = require('./routes/profile');
const festivalRoutes = require('./routes/festivals');
const bookingRoutes = require('./routes/bookings');
const contactRoutes = require('./routes/contact');
const guideRoutes = require('./routes/guides');
const notificationRoutes = require('./routes/notifications');
const moodAnalyzerRoutes = require('./routes/moodAnalyzer');
const paymentRoutes = require('./routes/payments');

dotenv.config();

const app = express();

// Middleware - CORS with all origins allowed
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB and seed data
connectDB().then(async () => {
  try {
    await seedGuides();
  } catch (error) {
    console.error('Error seeding guides:', error);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/yatra-shayak', yatraShayakRoutes);
app.use('/api/guides', guideRegistrationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/local-guides', guideRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mood-analyze', moodAnalyzerRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running! ✅' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 DarShana Travel Backend Started    ║
║  Port: ${PORT}                            
║  Environment: ${process.env.NODE_ENV || 'development'}
╚════════════════════════════════════════╝
  `);
});
