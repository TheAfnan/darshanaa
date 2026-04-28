const mongoose = require('mongoose');
const LocalGuide = require('../models/LocalGuide');

const guidesData = [
  {
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
    verified: true,
    pricePerDay: 300,
  },
  {
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
    verified: true,
    pricePerDay: 250,
  },
  {
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
    pricePerDay: 700,
  },
  {
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
    verified: true,
    pricePerDay: 200,
  },
  {
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
    verified: true,
    pricePerDay: 270,
  },
  {
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
    verified: true,
    pricePerDay: 220,
  },
  {
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
    verified: true,
    pricePerDay: 240,
  },
  {
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
    verified: true,
    pricePerDay: 260,
  },
];

const seedGuides = async () => {
  try {
    // Clear existing guides
    await LocalGuide.deleteMany({});
    console.log('Cleared existing guides');

    // Insert new guides
    const result = await LocalGuide.insertMany(guidesData);
    console.log(`✅ Successfully seeded ${result.length} local guides`);
    return result;
  } catch (error) {
    console.error('❌ Error seeding guides:', error.message);
    throw error;
  }
};

module.exports = seedGuides;
