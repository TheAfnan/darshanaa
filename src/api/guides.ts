// src/api/guides.ts
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface Guide {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  rating: number;
  reviews: number;
  profileImage: string;
  bio: string;
  languages: string[];
  verified: boolean;
  pricePerDay?: number;
  createdAt?: string;
}

export interface GuideAPIResponse {
  success?: boolean;
  guides?: Guide[];
  guide?: Guide;
  message?: string;
  error?: string;
}

/**
 * Fetch all guides
 */
export async function fetchAllGuides(): Promise<Guide[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/local-guides/`);
    const data = await response.json();
    return Array.isArray(data) ? data : (data.guides || []);
  } catch (error) {
    console.error('Error fetching guides:', error);
    return [];
  }
}

/**
 * Fetch featured guides (top 6)
 */
export async function fetchFeaturedGuides(): Promise<Guide[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/local-guides/featured`);
    const data = await response.json();
    return data.guides || [];
  } catch (error) {
    console.error('Error fetching featured guides:', error);
    return [];
  }
}

/**
 * Fetch guides by location
 */
export async function fetchGuidesByLocation(location: string): Promise<Guide[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/local-guides/by-location?location=${encodeURIComponent(location)}`
    );
    const data = await response.json();
    return data.guides || [];
  } catch (error) {
    console.error('Error fetching guides by location:', error);
    return [];
  }
}

/**
 * Fetch guides with advanced filtering
 */
export async function fetchFilteredGuides(params: {
  location?: string;
  specialty?: string;
  language?: string;
  minRating?: number;
  maxPrice?: number;
  sortBy?: 'rating' | 'price-low' | 'price-high' | 'reviews';
}): Promise<Guide[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.location) queryParams.append('location', params.location);
    if (params.specialty) queryParams.append('specialty', params.specialty);
    if (params.language) queryParams.append('language', params.language);
    if (params.minRating) queryParams.append('minRating', params.minRating.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const response = await fetch(
      `${API_BASE_URL}/api/local-guides/filtered?${queryParams.toString()}`
    );
    const data = await response.json();
    return data.guides || [];
  } catch (error) {
    console.error('Error fetching filtered guides:', error);
    return [];
  }
}

/**
 * Fetch single guide by ID
 */
export async function fetchGuideById(guideId: string): Promise<Guide | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/local-guides/${guideId}`);
    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error('Error fetching guide by ID:', error);
    return null;
  }
}

/**
 * Submit guide request
 */
export async function submitGuideRequest(
  guideId: string,
  requestType: string,
  message: string,
  token: string
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/local-guides/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        guideId,
        requestType,
        message,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error submitting guide request:', error);
    throw error;
  }
}

/**
 * Get user's guide requests
 */
export async function getUserGuideRequests(token: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/local-guides/user/requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching user requests:', error);
    return [];
  }
}
