# Local Guides API Documentation

## Overview
The Local Guides API provides endpoints to fetch local guides for various travel locations in India. Guides are verified professionals who can provide authentic travel experiences.

## Base URL
```
http://localhost:3001/api/local-guides
```

## Endpoints

### 1. Get All Guides
Fetch all available guides.

**Endpoint:** `GET /`

**Query Parameters:** None

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Rajesh Kumar",
    "email": "rajesh.guide@example.com",
    "phone": "+91-9876543210",
    "location": "Agra",
    "specialties": ["Heritage", "Monuments", "History"],
    "rating": 4.8,
    "reviews": 45,
    "profileImage": "https://...",
    "bio": "Certified guide with 10+ years experience...",
    "languages": ["English", "Hindi", "Spanish"],
    "pricePerDay": 800,
    "verified": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Get Featured Guides
Get the top 6 highest-rated verified guides.

**Endpoint:** `GET /featured`

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "guides": [
    { /* guide objects */ }
  ]
}
```

---

### 3. Get Guides by Location
Filter guides by a specific location.

**Endpoint:** `GET /by-location?location={location}`

**Query Parameters:**
- `location` (required): City or location name (e.g., "Agra", "Delhi", "Jaipur")

**Example:**
```
GET /by-location?location=Agra
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "guides": [ /* guide objects */ ]
}
```

---

### 4. Get Filtered Guides
Advanced filtering with multiple parameters.

**Endpoint:** `GET /filtered`

**Query Parameters:**
- `location` (optional): City name
- `specialty` (optional): Specialty name (e.g., "Heritage", "Adventure", "Culinary")
- `language` (optional): Language spoken (e.g., "English", "Hindi", "French")
- `minRating` (optional): Minimum rating (0-5)
- `maxPrice` (optional): Maximum price per day
- `sortBy` (optional): Sort option - `rating`, `price-low`, `price-high`, `reviews`

**Example:**
```
GET /filtered?location=Jaipur&specialty=Heritage&minRating=4.5&maxPrice=800&sortBy=rating
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "guides": [ /* guide objects */ ]
}
```

---

### 5. Get Guide by ID
Fetch details of a specific guide.

**Endpoint:** `GET /{guideId}`

**Path Parameters:**
- `guideId` (required): MongoDB ObjectId of the guide

**Example:**
```
GET /507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Rajesh Kumar",
  "email": "rajesh.guide@example.com",
  /* ... full guide details ... */
}
```

---

### 6. Submit Guide Request (Authenticated)
Request a guide for a trip. Requires authentication token.

**Endpoint:** `POST /requests`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "guideId": "507f1f77bcf86cd799439011",
  "requestType": "tour_booking",
  "message": "I would like to book a tour for 3 days starting next week"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "status": "pending",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "message": "Request sent to guide. They will respond shortly."
}
```

---

### 7. Get User's Guide Requests (Authenticated)
Fetch all guide requests made by the logged-in user.

**Endpoint:** `GET /user/requests`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439000",
    "guideId": { /* guide object */ },
    "requestType": "tour_booking",
    "message": "...",
    "status": "accepted",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
]
```

---

## Available Specialties
- Heritage
- Monuments
- History
- Spiritual
- Photography
- Cultural
- Palace Tours
- Shopping
- Beach
- Adventure
- Nightlife
- Culinary
- Backwaters
- Nature
- Houseboat
- Old Delhi
- Markets
- Biryani Tours

## Available Languages
- English
- Hindi
- Spanish
- French
- German
- Portuguese
- Malayalam
- Telugu
- Urdu

## Error Handling

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Location is required"
}
```

**404 Not Found:**
```json
{
  "message": "Guide not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Failed to fetch guides",
  "error": "Error details..."
}
```

---

## Frontend Usage Example

### Using the Guides Service

```typescript
import { fetchFilteredGuides, fetchGuidesByLocation, fetchFeaturedGuides } from '@/api/guides';

// Get all guides from a location
const guides = await fetchGuidesByLocation('Agra');

// Get featured guides
const featured = await fetchFeaturedGuides();

// Advanced filtering
const filtered = await fetchFilteredGuides({
  location: 'Jaipur',
  specialty: 'Heritage',
  minRating: 4.5,
  maxPrice: 800,
  sortBy: 'rating'
});
```

---

## Seed Data
The backend automatically seeds 8 sample guides when it starts:
1. **Rajesh Kumar** - Agra (Heritage expert)
2. **Lakshmi Sharma** - Varanasi (Spiritual & Photography)
3. **Arjun Singh** - Jaipur (Palace Tours)
4. **Priya Desai** - Goa (Beach & Adventure)
5. **Vikram Patel** - Lucknow (Culinary & Heritage)
6. **Anjali Nair** - Kochi (Backwaters & Nature)
7. **Sanjay Gupta** - Delhi (Street Food & History)
8. **Supriya Rao** - Hyderabad (Biryani & Heritage)

---

## Notes
- All guides are verified professionals
- Ratings are 0-5 scale
- Prices are in INR (Indian Rupees) per day
- Profile images are from Unsplash
- The API is CORS-enabled for all origins
