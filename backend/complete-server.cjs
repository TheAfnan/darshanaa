// Complete Backend Server with Auth + Festival APIs (CommonJS)
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'darshana-travel-secret-key-2025';

// CORS - Allow all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ═══════════════════════════════════════════════════════════════════
// IN-MEMORY DATABASE (for demo - replace with MongoDB in production)
// ═══════════════════════════════════════════════════════════════════
const users = new Map();
const subscriptions = new Map();

// Add demo admin user
const demoAdminHash = bcrypt.hashSync('admin123', 10);
users.set('admin@darshana.com', {
  id: 'admin-001',
  fullName: 'Admin User',
  email: 'admin@darshana.com',
  phone: '9999999999',
  password: demoAdminHash,
  username: 'admin',
  usernameChangeCount: 0,
  role: 'admin',
  profileImage: null,
  createdAt: new Date().toISOString()
});

// Add demo regular user
const demoUserHash = bcrypt.hashSync('user123', 10);
users.set('user@darshana.com', {
  id: 'user-001',
  fullName: 'Demo User',
  email: 'user@darshana.com',
  phone: '8888888888',
  password: demoUserHash,
  username: 'demouser',
  usernameChangeCount: 0,
  role: 'user',
  profileImage: null,
  createdAt: new Date().toISOString()
});

// ═══════════════════════════════════════════════════════════════════
// AUTH MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ═══════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════════

// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (users.has(email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user-${Date.now()}`;
    
    const newUser = {
      id: userId,
      fullName,
      email,
      phone,
      password: hashedPassword,
      username: email.split('@')[0],
      usernameChangeCount: 0,
      role: 'user',
      profileImage: null,
      createdAt: new Date().toISOString()
    };
    
    users.set(email, newUser);
    
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = users.get(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// GET CURRENT USER (ME)
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// UPDATE PROFILE
app.put('/api/auth/update-profile', authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, username } = req.body;
    
    const user = Array.from(users.values()).find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Handle username change with limit
    if (username && username !== user.username) {
      if (user.usernameChangeCount >= 2) {
        return res.status(400).json({ message: 'Username can only be changed 2 times' });
      }
      user.username = username;
      user.usernameChangeCount += 1;
    }
    
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    
    users.set(user.email, user);
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// GET PROFILE (Legacy endpoint)
app.get('/api/profile', authMiddleware, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return profile with trips data structure
    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      upcomingTrips: [],
      pastTrips: [],
      savedDestinations: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ═══════════════════════════════════════════════════════════════════
// FESTIVAL ROUTES
// ═══════════════════════════════════════════════════════════════════

const sampleFestivals = [
  // Past month (October 2025)
  {
    _id: 'durga-puja-2025',
    name: 'Durga Puja',
    region: 'East India',
    date: '2025-10-21',
    description: 'The grand festival celebrating Goddess Durga with elaborate pandals, cultural performances, and community gatherings across Kolkata and Bengal.',
    subscribers: []
  },
  {
    _id: 'dussehra-2025',
    name: 'Dussehra / Vijayadashami',
    region: 'North India',
    date: '2025-10-23',
    description: 'Victory of good over evil celebrated with Ramlila performances and burning of Ravana effigies.',
    subscribers: []
  },
  // This month (November 2025)
  {
    _id: 'diwali-2025',
    name: 'Diwali - Festival of Lights',
    region: 'North India',
    date: '2025-11-12',
    description: 'The biggest festival of India! Celebrate with diyas, fireworks, rangoli, sweets, and family gatherings.',
    subscribers: []
  },
  {
    _id: 'bhai-dooj-2025',
    name: 'Bhai Dooj',
    region: 'North India',
    date: '2025-11-14',
    description: 'A celebration of the bond between brothers and sisters, with tilak ceremonies and gift exchanges.',
    subscribers: []
  },
  {
    _id: 'chhath-puja-2025',
    name: 'Chhath Puja',
    region: 'East India',
    date: '2025-11-16',
    description: 'Ancient Hindu festival dedicated to Sun God. Devotees fast and offer prayers at riverbanks.',
    subscribers: []
  },
  {
    _id: 'kartik-purnima-2025',
    name: 'Kartik Purnima',
    region: 'Central India',
    date: '2025-11-27',
    description: 'Sacred full moon day with Dev Deepawali celebrations in Varanasi. Thousands of diyas light up the ghats.',
    subscribers: []
  },
  {
    _id: 'guru-nanak-jayanti-2025',
    name: 'Guru Nanak Jayanti',
    region: 'North India',
    date: '2025-11-15',
    description: 'Birth anniversary of Guru Nanak Dev Ji. Grand celebrations at Golden Temple Amritsar.',
    subscribers: []
  },
  // Next month (December 2025)
  {
    _id: 'hornbill-2025',
    name: 'Hornbill Festival',
    region: 'North-East India',
    date: '2025-12-01',
    description: 'The "Festival of Festivals" in Nagaland showcasing tribal culture, traditional dances, and local cuisine.',
    subscribers: []
  },
  {
    _id: 'rann-utsav-2025',
    name: 'Rann Utsav',
    region: 'West India',
    date: '2025-12-10',
    description: 'Experience the magical white desert of Kutch under full moon. Folk music, handicrafts, and tent stays.',
    subscribers: []
  },
  {
    _id: 'christmas-goa-2025',
    name: 'Christmas in Goa',
    region: 'West India',
    date: '2025-12-25',
    description: 'Celebrate Christmas with Portuguese-influenced traditions, midnight masses, and beach parties.',
    subscribers: []
  },
  {
    _id: 'konark-dance-2025',
    name: 'Konark Dance Festival',
    region: 'East India',
    date: '2025-12-20',
    description: 'Classical dance performances against the backdrop of the magnificent Sun Temple.',
    subscribers: []
  }
];

// Get festival alerts
app.get('/api/festivals/alerts', (req, res) => {
  const { region } = req.query;
  
  let festivals = [...sampleFestivals];
  
  if (region) {
    festivals = festivals.filter(f => 
      f.region.toLowerCase().includes(region.toLowerCase())
    );
  }
  
  res.json({ 
    success: true,
    alerts: festivals 
  });
});

// Subscribe to festival
app.post('/api/festivals/subscribe/:festivalId', authMiddleware, (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.userId;
  
  if (!subscriptions.has(userId)) {
    subscriptions.set(userId, []);
  }
  
  const userSubs = subscriptions.get(userId);
  if (!userSubs.includes(festivalId)) {
    userSubs.push(festivalId);
  }
  
  res.json({ 
    success: true, 
    message: 'Subscribed successfully',
    festivalId 
  });
});

// Unsubscribe from festival
app.delete('/api/festivals/unsubscribe/:festivalId', authMiddleware, (req, res) => {
  const { festivalId } = req.params;
  const userId = req.user.userId;
  
  if (subscriptions.has(userId)) {
    const userSubs = subscriptions.get(userId);
    const idx = userSubs.indexOf(festivalId);
    if (idx > -1) userSubs.splice(idx, 1);
  }
  
  res.json({ 
    success: true, 
    message: 'Unsubscribed successfully',
    festivalId 
  });
});

// ═══════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════
// GREEN ROUTES / SUSTAINABLE TRAVEL API
// ═══════════════════════════════════════════════════════════════════

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Major Indian cities coordinates
const cityCoordinates = {
  'delhi': { lat: 28.6139, lon: 77.2090 },
  'new delhi': { lat: 28.6139, lon: 77.2090 },
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'bangalore': { lat: 12.9716, lon: 77.5946 },
  'bengaluru': { lat: 12.9716, lon: 77.5946 },
  'chennai': { lat: 13.0827, lon: 80.2707 },
  'kolkata': { lat: 22.5726, lon: 88.3639 },
  'hyderabad': { lat: 17.3850, lon: 78.4867 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'jaipur': { lat: 26.9124, lon: 75.7873 },
  'lucknow': { lat: 26.8467, lon: 80.9462 },
  'kanpur': { lat: 26.4499, lon: 80.3319 },
  'nagpur': { lat: 21.1458, lon: 79.0882 },
  'indore': { lat: 22.7196, lon: 75.8577 },
  'thane': { lat: 19.2183, lon: 72.9781 },
  'bhopal': { lat: 23.2599, lon: 77.4126 },
  'visakhapatnam': { lat: 17.6868, lon: 83.2185 },
  'patna': { lat: 25.5941, lon: 85.1376 },
  'vadodara': { lat: 22.3072, lon: 73.1812 },
  'goa': { lat: 15.2993, lon: 74.1240 },
  'shimla': { lat: 31.1048, lon: 77.1734 },
  'manali': { lat: 32.2396, lon: 77.1887 },
  'rishikesh': { lat: 30.0869, lon: 78.2676 },
  'varanasi': { lat: 25.3176, lon: 82.9739 },
  'agra': { lat: 27.1767, lon: 78.0081 },
  'udaipur': { lat: 24.5854, lon: 73.7125 },
  'jodhpur': { lat: 26.2389, lon: 73.0243 },
  'amritsar': { lat: 31.6340, lon: 74.8723 },
  'darjeeling': { lat: 27.0360, lon: 88.2627 },
  'ooty': { lat: 11.4102, lon: 76.6950 },
  'munnar': { lat: 10.0889, lon: 77.0595 },
  'kerala': { lat: 10.8505, lon: 76.2711 },
  'kochi': { lat: 9.9312, lon: 76.2673 },
  'mysore': { lat: 12.2958, lon: 76.6394 },
  'hampi': { lat: 15.3350, lon: 76.4600 },
  'leh': { lat: 34.1526, lon: 77.5771 },
  'ladakh': { lat: 34.1526, lon: 77.5771 },
  'srinagar': { lat: 34.0837, lon: 74.7973 },
  'chandigarh': { lat: 30.7333, lon: 76.7794 },
  'dehradun': { lat: 30.3165, lon: 78.0322 },
  'haridwar': { lat: 29.9457, lon: 78.1642 },
  'ajmer': { lat: 26.4499, lon: 74.6399 },
  'pushkar': { lat: 26.4897, lon: 74.5511 },
  'jaisalmer': { lat: 26.9157, lon: 70.9083 },
  'ranthambore': { lat: 26.0173, lon: 76.5026 },
  'khajuraho': { lat: 24.8318, lon: 79.9199 },
  'puri': { lat: 19.8135, lon: 85.8312 },
  'konark': { lat: 19.8876, lon: 86.0945 },
  'gangtok': { lat: 27.3389, lon: 88.6065 },
  'shillong': { lat: 25.5788, lon: 91.8933 },
  'guwahati': { lat: 26.1445, lon: 91.7362 },
  'kaziranga': { lat: 26.5775, lon: 93.1711 },
  'andaman': { lat: 11.7401, lon: 92.6586 },
  'port blair': { lat: 11.6234, lon: 92.7265 },
  'pondicherry': { lat: 11.9416, lon: 79.8083 },
  'puducherry': { lat: 11.9416, lon: 79.8083 },
  'mahabalipuram': { lat: 12.6269, lon: 80.1927 },
  'coorg': { lat: 12.3375, lon: 75.8069 },
  'kodaikanal': { lat: 10.2381, lon: 77.4892 },
  'alleppey': { lat: 9.4981, lon: 76.3388 },
  'madurai': { lat: 9.9252, lon: 78.1198 },
  'tirupati': { lat: 13.6288, lon: 79.4192 },
  'shirdi': { lat: 19.7666, lon: 74.4764 },
  'nashik': { lat: 19.9975, lon: 73.7898 },
  'aurangabad': { lat: 19.8762, lon: 75.3433 },
  'ellora': { lat: 20.0258, lon: 75.1780 },
  'ajanta': { lat: 20.5519, lon: 75.7033 },
  'mount abu': { lat: 24.5926, lon: 72.7156 },
  'dwarka': { lat: 22.2442, lon: 68.9685 },
  'somnath': { lat: 20.8880, lon: 70.4012 },
  'rann of kutch': { lat: 23.7337, lon: 69.8597 },
  'statue of unity': { lat: 21.8380, lon: 73.7191 },
  'diu': { lat: 20.7144, lon: 70.9874 },
  'daman': { lat: 20.3974, lon: 72.8328 }
};

// Transport mode configurations
const transportModes = {
  flight: { co2PerKm: 0.255, costPerKm: 8.5, speedKmh: 800, ecoRating: 2 },
  train: { co2PerKm: 0.041, costPerKm: 1.2, speedKmh: 80, ecoRating: 8 },
  bus: { co2PerKm: 0.089, costPerKm: 1.5, speedKmh: 50, ecoRating: 7 },
  car: { co2PerKm: 0.171, costPerKm: 5.0, speedKmh: 60, ecoRating: 4 },
  electricCar: { co2PerKm: 0.053, costPerKm: 3.0, speedKmh: 60, ecoRating: 8 },
  bike: { co2PerKm: 0.0, costPerKm: 0.0, speedKmh: 15, ecoRating: 10 },
  walk: { co2PerKm: 0.0, costPerKm: 0.0, speedKmh: 5, ecoRating: 10 },
  metro: { co2PerKm: 0.033, costPerKm: 0.5, speedKmh: 35, ecoRating: 9 }
};

// Calculate routes for all transport modes
function calculateRoutes(from, to, distance) {
  const routes = [];
  
  for (const [mode, config] of Object.entries(transportModes)) {
    // Skip walking/biking for very long distances
    if (mode === 'walk' && distance > 20) continue;
    if (mode === 'bike' && distance > 100) continue;
    if (mode === 'metro' && distance > 50) continue;
    if (mode === 'flight' && distance < 200) continue;
    
    const duration = distance / config.speedKmh;
    const co2 = distance * config.co2PerKm;
    const cost = distance * config.costPerKm;
    const ecoReward = Math.round(config.ecoRating * distance / 10);
    
    routes.push({
      mode: mode.charAt(0).toUpperCase() + mode.slice(1).replace(/([A-Z])/g, ' $1'),
      distance: Math.round(distance * 10) / 10,
      duration: formatDuration(duration),
      durationHours: Math.round(duration * 10) / 10,
      co2: Math.round(co2 * 100) / 100,
      cost: Math.round(cost),
      ecoRating: config.ecoRating,
      ecoReward: ecoReward,
      isGreenest: false,
      isFastest: false,
      isCheapest: false
    });
  }
  
  // Mark special routes
  if (routes.length > 0) {
    const greenest = routes.reduce((a, b) => a.co2 < b.co2 ? a : b);
    const fastest = routes.reduce((a, b) => a.durationHours < b.durationHours ? a : b);
    const cheapest = routes.reduce((a, b) => a.cost < b.cost ? a : b);
    
    greenest.isGreenest = true;
    fastest.isFastest = true;
    cheapest.isCheapest = true;
  }
  
  return routes;
}

function formatDuration(hours) {
  if (hours < 1) {
    return `${Math.round(hours * 60)} mins`;
  } else if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  } else {
    const d = Math.floor(hours / 24);
    const h = Math.round(hours % 24);
    return h > 0 ? `${d}d ${h}h` : `${d}d`;
  }
}

// POST /api/routes - Calculate green routes
app.post('/api/routes', (req, res) => {
  try {
    const { from, to } = req.body;
    
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: 'Both "from" and "to" locations are required'
      });
    }
    
    const fromLower = from.toLowerCase().trim();
    const toLower = to.toLowerCase().trim();
    
    const fromCoords = cityCoordinates[fromLower];
    const toCoords = cityCoordinates[toLower];
    
    if (!fromCoords) {
      return res.status(400).json({
        success: false,
        error: `Origin city "${from}" not found. Try major Indian cities like Delhi, Mumbai, Bangalore, etc.`
      });
    }
    
    if (!toCoords) {
      return res.status(400).json({
        success: false,
        error: `Destination city "${to}" not found. Try major Indian cities like Delhi, Mumbai, Bangalore, etc.`
      });
    }
    
    const distance = calculateDistance(fromCoords.lat, fromCoords.lon, toCoords.lat, toCoords.lon);
    const routes = calculateRoutes(from, to, distance);
    
    res.json({
      success: true,
      data: {
        from: { name: from, coordinates: fromCoords },
        to: { name: to, coordinates: toCoords },
        distance: Math.round(distance * 10) / 10,
        routes: routes.sort((a, b) => a.co2 - b.co2) // Sort by eco-friendliness
      }
    });
  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate routes'
    });
  }
});

// GET /api/routes/cities - Get list of supported cities
app.get('/api/routes/cities', (req, res) => {
  const cities = Object.keys(cityCoordinates).map(city => 
    city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  );
  res.json({
    success: true,
    data: [...new Set(cities)].sort()
  });
});

// ═══════════════════════════════════════════════════════════════════
// LOCAL GUIDES DATA
// ═══════════════════════════════════════════════════════════════════
const guidesData = [
  {
    _id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.guide@example.com',
    phone: '+91-9876543210',
    location: 'Agra',
    specialties: ['Heritage', 'Monuments', 'History'],
    rating: 4.8,
    reviews: 45,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Certified guide with 10+ years experience in Agra monuments. Expert in Taj Mahal history.',
    languages: ['English', 'Hindi', 'Spanish'],
    pricePerDay: 300,
    verified: true,
  },
  {
    _id: '2',
    name: 'Lakshmi Sharma',
    email: 'lakshmi.guide@example.com',
    phone: '+91-9876543211',
    location: 'Varanasi',
    specialties: ['Spiritual', 'Photography', 'Cultural'],
    rating: 4.6,
    reviews: 38,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Expert in Varanasi spirituality and Ghats. Photographer friendly tours.',
    languages: ['English', 'Hindi', 'French'],
    pricePerDay: 250,
    verified: true,
  },
  {
    _id: '3',
    name: 'Arjun Singh',
    email: 'arjun.guide@example.com',
    phone: '+91-9876543212',
    location: 'Jaipur',
    specialties: ['Palace Tours', 'Shopping', 'Heritage'],
    rating: 4.7,
    reviews: 52,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Local Jaipur expert with deep knowledge of Pink City bazaars and palaces.',
    languages: ['English', 'Hindi', 'German'],
    pricePerDay: 280,
    verified: true,
  },
  {
    _id: '4',
    name: 'Priya Desai',
    email: 'priya.guide@example.com',
    phone: '+91-9876543213',
    location: 'Goa',
    specialties: ['Beach', 'Adventure', 'Nightlife'],
    rating: 4.5,
    reviews: 61,
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    bio: 'Beach and adventure enthusiast. Perfect for backpackers and adventure seekers.',
    languages: ['English', 'Hindi', 'Portuguese'],
    pricePerDay: 200,
    verified: true,
  },
  {
    _id: '5',
    name: 'Vikram Patel',
    email: 'vikram.guide@example.com',
    phone: '+91-9876543214',
    location: 'Lucknow',
    specialties: ['Culinary', 'Heritage', 'History'],
    rating: 4.9,
    reviews: 43,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Lucknow food and heritage expert. Master guide for authentic Awadhi experience.',
    languages: ['English', 'Hindi', 'Urdu'],
    pricePerDay: 270,
    verified: true,
  },
  {
    _id: '6',
    name: 'Anjali Nair',
    email: 'anjali.guide@example.com',
    phone: '+91-9876543215',
    location: 'Kochi',
    specialties: ['Backwaters', 'Nature', 'Houseboat'],
    rating: 4.4,
    reviews: 35,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    bio: 'Kerala backwater specialist. Expert in houseboat tours and nature walks.',
    languages: ['English', 'Hindi', 'Malayalam'],
    pricePerDay: 220,
    verified: true,
  },
  {
    _id: '7',
    name: 'Sanjay Gupta',
    email: 'sanjay.guide@example.com',
    phone: '+91-9876543216',
    location: 'Delhi',
    specialties: ['Old Delhi', 'Markets', 'History'],
    rating: 4.6,
    reviews: 48,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Delhi street food and Old Delhi expert. Perfect walking tour guide.',
    languages: ['English', 'Hindi'],
    pricePerDay: 240,
    verified: true,
  },
  {
    _id: '8',
    name: 'Supriya Rao',
    email: 'supriya.guide@example.com',
    phone: '+91-9876543217',
    location: 'Hyderabad',
    specialties: ['Biryani Tours', 'Heritage', 'Shopping'],
    rating: 4.7,
    reviews: 40,
    profileImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop',
    bio: 'Hyderabad food and culture expert. Biryani specialist and heritage guide.',
    languages: ['English', 'Hindi', 'Telugu'],
    pricePerDay: 260,
    verified: true,
  },
];

// ═══════════════════════════════════════════════════════════════════
// LOCAL GUIDES ROUTES
// ═══════════════════════════════════════════════════════════════════

// GET /api/local-guides - Get all guides
app.get('/api/local-guides', (req, res) => {
  const { location } = req.query;
  
  let guides = guidesData;
  
  if (location) {
    guides = guides.filter(g => g.location.toLowerCase().includes(location.toLowerCase()));
  }
  
  guides.sort((a, b) => b.rating - a.rating);
  
  res.json(guides);
});

// GET /api/local-guides/featured - Get top 6 guides
app.get('/api/local-guides/featured', (req, res) => {
  const featured = guidesData
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
  
  res.json({
    success: true,
    guides: featured
  });
});

// GET /api/local-guides/by-location - Get guides by location
app.get('/api/local-guides/by-location', (req, res) => {
  const { location } = req.query;
  
  if (!location) {
    return res.status(400).json({ 
      success: false,
      message: 'Location is required' 
    });
  }
  
  const guides = guidesData.filter(g => 
    g.location.toLowerCase().includes(location.toLowerCase())
  );
  
  res.json({
    success: true,
    count: guides.length,
    guides: guides
  });
});

// GET /api/local-guides/filtered - Get guides with advanced filtering
app.get('/api/local-guides/filtered', (req, res) => {
  const { location, specialty, language, minRating, maxPrice, sortBy } = req.query;
  
  let guides = guidesData;
  
  if (location) {
    guides = guides.filter(g => g.location.toLowerCase().includes(location.toLowerCase()));
  }
  
  if (specialty) {
    guides = guides.filter(g => g.specialties.includes(specialty));
  }
  
  if (language) {
    guides = guides.filter(g => g.languages.includes(language));
  }
  
  if (minRating) {
    guides = guides.filter(g => g.rating >= parseFloat(minRating));
  }
  
  if (maxPrice) {
    guides = guides.filter(g => g.pricePerDay <= parseInt(maxPrice));
  }
  
  // Sort
  if (sortBy === 'price-low') {
    guides.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price-high') {
    guides.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sortBy === 'reviews') {
    guides.sort((a, b) => b.reviews - a.reviews);
  } else {
    guides.sort((a, b) => b.rating - a.rating);
  }
  
  res.json({
    success: true,
    count: guides.length,
    guides: guides
  });
});

// GET /api/local-guides/:guideId - Get single guide
app.get('/api/local-guides/:guideId', (req, res) => {
  const { guideId } = req.params;
  const guide = guidesData.find(g => g._id === guideId);
  
  if (!guide) {
    return res.status(404).json({ message: 'Guide not found' });
  }
  
  res.json(guide);
});

// ═══════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🚀 DarShana Travel Complete API Server                       ║
║  Port: ${PORT}                                                   ║
║                                                               ║
║  Demo Accounts:                                               ║
║  👤 Admin: admin@darshana.com / admin123                      ║
║  👤 User:  user@darshana.com / user123                        ║
║                                                               ║
║  Endpoints:                                                   ║
║  • POST /api/auth/signup                                      ║
║  • POST /api/auth/login                                       ║
║  • GET  /api/auth/me                                          ║
║  • PUT  /api/auth/update-profile                              ║
║  • GET  /api/festivals/alerts                                 ║
║  • POST /api/routes (Green Route Planner)                     ║
║  • GET  /api/routes/cities                                    ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});
