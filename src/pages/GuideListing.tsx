import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Loader, AlertCircle, Mail, Phone } from 'lucide-react';
import GuideCard from '../components/GuideCard';

interface Guide {
  _id: string;
  name: string;
  location: string;
  specialties: string[];
  languages: string[];
  rating: number;
  reviews: number;
  pricePerDay: number;
  bio: string;
  profileImage: string;
  verified: boolean;
  email?: string;
  phone?: string;
}

const GuideListing = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [guides, searchLocation, selectedSpecialization, maxPrice, minRating, sortBy]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/local-guides`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      // Handle both array and object responses
      const guideList = Array.isArray(data) ? data : (data.guides || []);
      setGuides(guideList);
      setError('');
    } catch (err) {
      console.error('Error fetching guides:', err);
      setError('Failed to fetch guides. Please try again.');
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const filterGuides = () => {
    let filtered = guides;

    if (searchLocation.trim()) {
      filtered = filtered.filter(guide =>
        guide.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(guide =>
        guide.specialties?.includes(selectedSpecialization)
      );
    }

    // Price filter
    filtered = filtered.filter(guide => (guide.pricePerDay || 0) <= maxPrice);

    // Rating filter
    filtered = filtered.filter(guide => (guide.rating || 0) >= minRating);

    // Sorting
    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    setFilteredGuides(filtered);
  };

  const handleContactGuide = async () => {
    if (!selectedGuide || !contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    setContactLoading(true);
    try {
      // Simulate sending message - in production, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setContactSuccess(true);
      setContactMessage('');
      
      // Reset success message after 3 seconds and close modal
      setTimeout(() => {
        setContactSuccess(false);
        setSelectedGuide(null);
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const specializations = ['Heritage', 'Monuments', 'History', 'Spiritual', 'Photography', 'Cultural', 'Palace Tours', 'Shopping', 'Beach', 'Adventure', 'Nightlife', 'Culinary', 'Backwaters', 'Nature', 'Houseboat', 'Old Delhi', 'Markets', 'Biryani Tours'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">🧳 Discover Local Guides</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg flex gap-2">
            <AlertCircle className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Location</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g., Delhi, Goa, Jaipur..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec} className="capitalize">
                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price ($/day)</label>
              <input
                type="number"
                value={maxPrice}
                min={0}
                max={10000}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <input
                type="number"
                value={minRating}
                min={0}
                max={5}
                step={0.1}
                onChange={e => setMinRating(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <label className="block text-sm font-medium text-gray-700">Sort By:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'rating' | 'price' | 'reviews')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="reviews">Reviews</option>
            </select>
            <div className="px-4 py-2 bg-gray-100 rounded-lg ml-auto">
              <p className="text-lg font-semibold text-gray-900">{filteredGuides.length} guides found</p>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Loader className="animate-spin text-purple-600" size={48} />
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-lg">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-2xl text-gray-600 mb-2">No guides found</p>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <GuideCard
                key={guide._id}
                guide={guide}
                onClick={() => setSelectedGuide(guide)}
              />
            ))}
          </div>
        )}

        {/* Guide Detail Modal */}
        {selectedGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedGuide.name}</h2>
                    {selectedGuide.verified && (
                      <span className="text-green-600 text-sm font-semibold">✓ Verified Guide</span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    <span className="text-lg">{selectedGuide.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-500" />
                    <span className="text-lg font-semibold">{selectedGuide.rating.toFixed(1)} ({selectedGuide.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">${selectedGuide.pricePerDay}</span>
                    <span className="text-gray-600">/day</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-700">{selectedGuide.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGuide.specialties.map(spec => (
                        <span key={spec} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGuide.languages.map(lang => (
                        <span key={lang} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    onClick={() => setSelectedGuide(null)}
                  >
                    Close
                  </button>
                </div>

                {/* Contact Form */}
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact This Guide</h3>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-600" />
                      <span className="text-gray-700">{selectedGuide.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-blue-600" />
                      <span className="text-gray-700">{selectedGuide.phone}</span>
                    </div>
                  </div>

                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell the guide about your travel plans..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
                    rows={4}
                  />
                  
                  {contactSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                      Message sent successfully! The guide will contact you soon.
                    </div>
                  )}

                  <button
                    className={`w-full text-white font-semibold py-3 rounded-lg transition-colors ${
                      contactLoading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={handleContactGuide}
                    disabled={contactLoading || !contactMessage.trim()}
                  >
                    {contactLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideListing;
