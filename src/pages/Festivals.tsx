import { AnimatePresence, motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Calendar, ChevronDown, ChevronRight, Clock, Grid, Map as MapIcon, MapPin, Search, Share2, TrendingUp, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Map from '../components/Map';

// --- Leaflet marker icon fix ---
const DefaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- DATA ARRAYS ---
const festivalsData = [
    {
        id: 1,
        name: "Diwali (दीपावली)",
        type: "Religious (Hindu, Sikh, Jain)",
        month: "October/November",
        location: "Pan-India",
        desc: "The festival of lights, celebrating the victory of light over darkness and good over evil. Associated with Goddess Lakshmi and Lord Rama's return.",
        img: "https://images.pexels.com/photos/1580085/pexels-photo-1580085.jpeg",
        lat: 20.5937,
        lng: 78.9629
    },
    {
        id: 2,
        name: "Holi (होली)",
        type: "Cultural/Religious (Hindu)",
        month: "March",
        location: "Pan-India, especially North India",
        desc: "The festival of colors, signifying the arrival of spring and the triumph of good over evil (Holika Dahan). People play with dry and wet colors.",
        img: "https://images.pexels.com/photos/15856547/pexels-photo-15856547.jpeg",
        lat: 28.6139,
        lng: 77.209
    },
    {
        id: 3,
        name: "Durga Puja (दुर्गा पूजा)",
        type: "Religious (Hindu)",
        month: "September/October",
        location: "Kolkata, West Bengal",
        desc: "Celebration of Goddess Durga's victory over the buffalo demon Mahishasura. Marked by grand Pandal installations and idol immersion.",
        img: "https://images.pexels.com/photos/7750148/pexels-photo-7750148.jpeg",
        lat: 22.5726,
        lng: 88.3639
    },
    {
        id: 4,
        name: "Pushkar Camel Fair (पुष्कर मेला)",
        type: "Cultural/Livestock",
        month: "November",
        location: "Pushkar, Rajasthan",
        desc: "A vibrant five-day livestock fair featuring camel trading, cultural performances, music, and competitions near the Pushkar Lake.",
        img: "https://images.pexels.com/photos/1707965/pexels-photo-1707965.jpeg",
        lat: 26.4907,
        lng: 74.5539
    },
    {
        id: 5,
        name: "Onam (ओणम)",
        type: "Cultural/Harvest (Hindu)",
        month: "August/September",
        location: "Kerala",
        desc: "Harvest festival marked by elaborate flower carpets (Pookalam), the grand Onam Sadhya feast, and spectacular snake boat races (Vallamkali).",
        img: "https://t4.ftcdn.net/jpg/16/53/15/17/240_F_1653151764_e1jXwVTun9tDX7T86V3mUkSsocNrfF9f.jpg",
        lat: 10.8505,
        lng: 76.2711
    },
    {
        id: 6,
        name: "Ganesh Chaturthi (गणेश चतुर्थी)",
        type: "Religious (Hindu)",
        month: "August/September",
        location: "Mumbai, Maharashtra, Karnataka",
        desc: "A 10-day celebration of the birth of Lord Ganesha, marked by the installation of large idols and a final grand immersion ceremony (Visarjan).",
        img: "https://images.pexels.com/photos/2939023/pexels-photo-2939023.jpeg",
        lat: 19.076,
        lng: 72.8777
    },
    {
        id: 7,
        name: "Eid al-Fitr (ईद उल-फित्र)",
        type: "Religious (Islam)",
        month: "Variable (Lunar)",
        location: "Pan-India",
        desc: "The 'Festival of Breaking the Fast' marks the end of Ramadan. Celebrated with congregational prayers, feasting, and the giving of charity (Zakat al-Fitr).",
        img: "https://images.pexels.com/photos/12049052/pexels-photo-12049052.jpeg",
        lat: 28.7041,
        lng: 77.1025
    },
    {
        id: 8,
        name: "Christmas",
        type: "Religious (Christian)",
        month: "December",
        location: "Goa, Mumbai, Northeast India",
        desc: "Celebration of the birth of Jesus Christ. Marked by midnight mass, carol singing, decorated Christmas trees, and gift-giving.",
        img: "https://images.pexels.com/photos/3149896/pexels-photo-3149896.jpeg",
        lat: 15.2993,
        lng: 74.124
    },
    {
        id: 9,
        name: "Gurupurab (गुरुपर्व)",
        type: "Religious (Sikh)",
        month: "October/November",
        location: "Punjab, Pan-India",
        desc: "Celebration of the birth of the Sikh Gurus. Marked by processions (Nagar Kirtan) and reading of the Guru Granth Sahib.",
        img: "https://www.goldentempleamritsar.org/high-resolution-images/famous-temples/golden-temple/Gurpurab.jpg",
        lat: 30.7333,
        lng: 76.7794
    },
    {
        id: 10,
        name: "Pongal (पोंगल)",
        type: "Harvest (Hindu)",
        month: "January",
        location: "Tamil Nadu",
        desc: "A four-day harvest festival dedicated to the Sun God (Surya). The second day is the main day, where rice is boiled until it spills over.",
        img: "https://images.pexels.com/photos/28820191/pexels-photo-28820191.jpeg",
        lat: 13.0827,
        lng: 80.2707
    },
    {
        id: 11,
        name: "Navratri (नवरात्रि)",
        type: "Religious (Hindu)",
        month: "September/October",
        location: "Gujarat, Maharashtra",
        desc: "A nine-night festival worshipping Goddess Durga. Famous for the traditional folk dances Garba and Dandiya Raas, especially in Gujarat.",
        img: "https://images.pexels.com/photos/9930818/pexels-photo-9930818.jpeg",
        lat: 23.0225,
        lng: 72.5714
    },
    {
        id: 12,
        name: "Kumbh Mela (कुंभ मेला)",
        type: "Religious (Hindu)",
        month: "Variable (Cycle)",
        location: "Allahabad, Haridwar, Ujjain, Nashik",
        desc: "One of the largest peaceful gatherings in the world, held once every three years on a rotating basis at four river-bank pilgrimage sites.",
        img: "https://images.pexels.com/photos/30218192/pexels-photo-30218192.jpeg",
        lat: 25.4358,
        lng: 81.8463
    },
    {
        id: 13,
        name: "Rath Yatra (रथ यात्रा)",
        type: "Religious (Hindu)",
        month: "June/July",
        location: "Puri, Odisha",
        desc: "The annual chariot festival of Lord Jagannath, his brother Balabhadra, and sister Subhadra. The deities are carried in massive, decorated chariots.",
        img: "https://images.pexels.com/photos/27170152/pexels-photo-27170152.jpeg",
        lat: 19.8142,
        lng: 85.831
    },
    {
        id: 14,
        name: "Hornbill Festival",
        type: "Cultural (Tribal)",
        month: "December",
        location: "Nagaland",
        desc: "A week-long annual festival showcasing the rich cultural heritage and traditions of the 16 Naga tribes with folk dances, sports, and crafts.",
        img: "https://images.pexels.com/photos/32656681/pexels-photo-32656681.jpeg",
        lat: 26.1824,
        lng: 94.5714
    },
    {
        id: 15,
        name: "Eid al-Adha (बकरी ईद)",
        type: "Religious (Islam)",
        month: "Variable (Lunar)",
        location: "Pan-India",
        desc: "The 'Festival of Sacrifice,' honoring Prophet Ibrahim's willingness to sacrifice his son. It involves animal sacrifice and distribution of meat.",
        img: "https://images.pexels.com/photos/34123513/pexels-photo-34123513.jpeg",
        lat: 24.5,
        lng: 79.0
    },
    {
      id: 16,
      name: "Ugadi (उगादी)",
      type: "New Year (Hindu)",
      month: "March/April",
      location: "Andhra Pradesh, Telangana, Karnataka",
      desc: "Telugu and Kannada New Year, celebrated with special dishes symbolizing different tastes of life and community rituals.",
      img: "https://data1.ibtimes.co.in/en/full/640477/ugadi-festival.jpg?h=450&l=50&t=40",
      lat: 17.385,
      lng: 78.4867
    },
    {
      id: 17,
      name: "Vishu (विशु)",
      type: "New Year (Hindu)",
      month: "April",
      location: "Kerala",
      desc: "Kerala New Year with Vishukkani (first sight), fireworks, feasts, and giving Vishukkaineetam (token gifts).",
      img: "https://pin.it/6cq4UDSjV",
      lat: 10.8505,
      lng: 76.2711
    },
    {
      id: 18,
      name: "Thaipusam",
      type: "Religious (Hindu)",
      month: "January/February",
      location: "Tamil Nadu",
      desc: "Devotion to Lord Murugan with kavadi processions and acts of penance including body piercings.",
      img: "https://pin.it/CYpQXlsPl",
      lat: 11.1271,
      lng: 78.6569
    },
    {
      id: 19,
      name: "Makara Sankranti",
      type: "Harvest (Hindu)",
      month: "January",
      location: "Karnataka, Andhra Pradesh",
      desc: "Harvest festival marking the sun's northward journey; kite flying, sesame sweets, and sharing ellu-bella.",
      img: "https://pin.it/5X9OCoaUk",
      lat: 15.3173,
      lng: 75.7139
    },
    {
      id: 20,
      name: "Navratri (South India)",
      type: "Religious (Hindu)",
      month: "September/October",
      location: "Tamil Nadu, Karnataka",
      desc: "Nine nights of worship for Goddess Durga; marked by Golu doll displays and vibrant community celebrations.",
      img: "https://pin.it/22fqk5O25",
      lat: 23.0225,
      lng: 72.5714
    },
    {
      id: 21,
      name: "Karaga Festival",
      type: "Cultural (Folk)",
      month: "April/May",
      location: "Bangalore, Karnataka",
      desc: "Ancient Draupadi procession featuring the priest carrying the decorated Karaga on his head through the city at night.",
      img: "https://pin.it/2qAFwxRxJ",
      lat: 12.9716,
      lng: 77.5946
    },
    {
      id: 22,
      name: "Thrissur Pooram",
      type: "Religious (Hindu)",
      month: "April/May",
      location: "Thrissur, Kerala",
      desc: "Kerala's grand temple festival famed for caparisoned elephants, percussion ensembles, and fireworks.",
      img: "https://pin.it/1PCHfCvO2",
      lat: 10.5276,
      lng: 76.2144
    },
    {
      id: 23,
      name: "Kollam Pooram",
      type: "Religious (Hindu)",
      month: "April/May",
      location: "Kollam, Kerala",
      desc: "Colorful annual temple festival with elephant processions and traditional music.",
      img: "https://pin.it/3CidcJsyb",
      lat: 8.8932,
      lng: 76.6141
    },
    {
      id: 24,
      name: "Makaravilakku",
      type: "Religious (Hindu)",
      month: "January",
      location: "Sabarimala, Kerala",
      desc: "Pilgrimage climax marked by witnessing the sacred light at Sabarimala hill shrine.",
      img: "https://pin.it/boQOIOTeE",
      lat: 9.2971,
      lng: 77.0259
    },
    {
        id: 10,
        name: "Lucknow Mahotsav",
        type: "Cultural",
        month: "November/December",
        location: "Lucknow, Uttar Pradesh",
        desc: "A vibrant festival showcasing the art, culture, and cuisine of Lucknow, including traditional dance and music performances.",
        img: "https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2020/11/lucknow-mahotsav4-copy-1604480553.jpg",
        lat: 26.8467,
        lng: 80.9462
    },
    {
        id: 11,
        name: "Chowk Ki Holi",
        type: "Cultural/Religious",
        month: "March",
        location: "Lucknow, Uttar Pradesh",
        desc: "A unique celebration of Holi in the historic Chowk area, featuring traditional music, dance, and colors.",
        img: "https://images.bhaskarassets.com/thumb/1200x900/web2images/521/2022/03/17/e07aa245-8241-4fc2-9f75-d59ae8aba46a1647518477613_1647519084.jpg",
        lat: 26.8467,
        lng: 80.9462
    },
    {
        id: 12,
        name: "Bada Mangal",
        type: "Religious",
        month: "May/June",
        location: "Lucknow, Uttar Pradesh",
        desc: "A grand celebration dedicated to Lord Hanuman, marked by free food distribution (bhandaras) and devotional songs.",
        img: "https://www.hindustantimes.com/ht-img/img/2023/05/09/1600x900/Devotees-at-a-bhandara-in-Lucknow-on-Tuesday---HT-_1683658804405.jpg",
        lat: 26.8467,
        lng: 80.9462
    },
    {
        id: 13,
        name: "Lucknow Literature Festival",
        type: "Cultural",
        month: "January",
        location: "Lucknow, Uttar Pradesh",
        desc: "A gathering of literary enthusiasts, featuring book launches, panel discussions, and cultural performances.",
        img: "https://upload.wikimedia.org/wikipedia/en/d/d8/Lucknow_literary_festival_logo.png",
        lat: 26.8467,
        lng: 80.9462
    },
    {
        id: 14,
        name: "Awadh Carnival",
        type: "Cultural",
        month: "February",
        location: "Lucknow, Uttar Pradesh",
        desc: "A celebration of the Awadhi heritage with food stalls, craft exhibitions, and cultural programs.",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAx3sirZ2053hTlRIlSmpTZEuHIV8hNaq_ZQ&s",
        lat: 26.8467,
        lng: 80.9462
    },
];

const historicalPlaces = [
    {
        id: 1,
        name: "Bara Imambara",
        desc: "A grand historical monument built by Asaf-ud-Daula in 1784, known for its central hall and the Bhool Bhulaiya (labyrinth).",
        img: "https://static.toiimg.com/photo/103890972.cms",
    },
    {
        id: 2,
        name: "Chota Imambara",
        desc: "An exquisite monument built by Muhammad Ali Shah, featuring chandeliers and intricate decorations.",
        img: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Chhota_imambara_Lucknow.jpg",
    },
    {
        id: 3,
        name: "Rumi Darwaza",
        desc: "An iconic gateway in Lucknow, often referred to as the Turkish Gate, showcasing Awadhi architecture.",
        img: "https://s7ap1.scene7.com/is/image/incredibleindia/2-rumi-darwaza-lucknow-uttar-pradesh-attr-hero?qlt=82&ts=1742170244420",
    },
    {
        id: 4,
        name: "Hazratganj Market",
        desc: "A historic shopping area in Lucknow, blending colonial and modern architecture, and a hub for cultural activities.",
        img: "https://yometro.com/images/places/hazratganj-market.jpg",
    },
    {
        id: 5,
        name: "Residency",
        desc: "A group of historical buildings that served as a refuge during the 1857 uprising, now a preserved archaeological site.",
        img: "https://example.com/residency.jpg"
    }
];

// ----------------------------------------------------------------------------------
// 2. 10 CULTURAL HIGHLIGHTS (सांस्कृतिक झलकियाँ) - Key non-festival cultural aspects
// ----------------------------------------------------------------------------------
const culturalHighlights = [
  {
    name: "Classical Dance Forms (शास्त्रीय नृत्य)",
    aspect: "Performing Arts",
    description: "Includes Bharatanatyam, Kathak, Kathakali, Odissi, Manipuri, Mohiniyattam, and Kuchipudi, each telling stories through intricate mudras and expressions.",
    img: "https://www.india-a2z.com/images/dance4.jpg",
    lat: 13.0802,
    lng: 80.2838
  },
  {
    name: "Yoga and Ayurveda (योग और आयुर्वेद)",
    aspect: "Wellness & Philosophy",
    description: "Ancient Indian systems for health and well-being. Yoga focuses on physical, mental, and spiritual practices, while Ayurveda is a traditional medicine system.",
    img: "https://www.kairali.com/pic/ayurveda-teachers.jpg",
    lat: 30.3165,
    lng: 78.0322
  },
  {
    name: "Indian Cuisine (भारतीय व्यंजन)",
    aspect: "Gastronomy",
    description: "Known for its vast regional diversity—from North Indian curries and bread to South Indian idli/dosa, Bengali fish, and Goan vindaloo. Focuses on spices and balance of six tastes.",
    img: "https://www.drishtiias.com/images/blogs/1651313Blog.jpg",
    lat: 28.6139,
    lng: 77.209
  },
  {
    name: "Bollywood & Regional Cinema (सिनेमा)",
    aspect: "Mass Media & Arts",
    description: "The world's largest film industry, headquartered in Mumbai, influencing music, fashion, and social narratives globally. Includes vibrant regional cinemas like Tamil, Telugu, and Bengali.",
    img: "",
    lat: 19.076,
    lng: 72.8777
  },
  {
    name: "Traditional Textiles & Sari (वस्त्र और साड़ी)",
    aspect: "Fashion & Craft",
    description: "India's rich textile heritage features handloom fabrics like Silk (Banarasi, Kanjivaram), Cotton (Khadi), and intricate works like Pashmina shawls and bandhani dying.",
    img: "https://www.treebo.com/blog/wp-content/uploads/2023/04/header-1.jpg",
    lat: 25.3176,
    lng: 82.9739
  },
  {
    name: "Kathputli (कठपुतली) & Puppetry",
    aspect: "Folk Arts",
    description: "Traditional string puppetry, most prominent in Rajasthan, used for storytelling and conveying social messages through intricate wooden dolls.",
    img: "https://as2.ftcdn.net/v2/jpg/06/54/65/01/1000_F_654650175_uwZWhUZnsg2YRni51rcm87Wz5ZOjjw99.jpg",
    lat: 26.9124,
    lng: 75.7873
  },
  {
    name: "Hindustani & Carnatic Music (शास्त्रीय संगीत)",
    aspect: "Music",
    description: "The two main branches of Indian classical music. Hindustani (North India) focuses on improvisational Ragas, while Carnatic (South India) is based on composed Kriti songs.",
    img: "https://th-i.thgim.com/public/incoming/jmt9yr/article69154713.ece/alternates/FREE_1200/2501_28_12_2024_10_22_33_1_DSC_3265.JPEG",
    lat: 22.5726,
    lng: 88.3639
  },
  {
    name: "Kalarippayattu (कलरीपयट्टु)",
    aspect: "Martial Arts",
    description: "One of the oldest surviving martial arts in the world, originating in Kerala. Involves strikes, kicks, weapon training, and healing methods.",
    img: "https://t4.ftcdn.net/jpg/08/77/30/95/240_F_877309584_1UYj1Y27iyb7ifQx9DUaKqevjy5kFdC7.jpg",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    name: "Tribal Art Forms (जनजातीय कला)",
    aspect: "Visual Arts",
    description: "Includes distinct styles like Warli painting (Maharashtra), Gond art (Madhya Pradesh), and Madhubani painting (Bihar), reflecting tribal life and myths.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbnU6N0dJ7rg82MLgVZD5RJfBQGnrqbVxEzQ&s",
    lat: 20.9042,
    lng: 74.7749
  },
  {
    name: "Miniature Painting (लघु चित्रकला)",
    aspect: "Visual Arts",
    description: "Detailed, colorful paintings developed under Mughal, Rajput, and Pahari royal courts, depicting epics, portraits, and courtly life on small scale.",
    img: "https://t3.ftcdn.net/jpg/14/97/84/14/240_F_1497841456_hjqQRp5Nl3EWK8ZZwrWaLdnSc11wmYzv.jpg",
    lat: 26.9124,
    lng: 75.7873
  },
  {
    name: "Bharatanatyam",
    aspect: "Classical Dance",
    description: "Temple dance tradition from Tamil Nadu noted for expressive abhinaya, precise footwork, and storytelling.",
    img: "https://images.pexels.com/photos/30481580/pexels-photo-30481580.jpeg",
    lat: 13.0802,
    lng: 80.2838
  },
  {
    name: "Kathakali",
    aspect: "Classical Dance",
    description: "Kerala's dramatic dance-theatre with elaborate makeup, face masks, and vigorous mudras narrating epics.",
    img: "https://images.pexels.com/photos/8610533/pexels-photo-8610533.jpeg",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    name: "Carnatic Music",
    aspect: "Classical Music",
    description: "South Indian classical tradition focused on kritis, ragam-tanam-pallavi, and rich improvisation.",
    img: "https://images.pexels.com/photos/10491556/pexels-photo-10491556.jpeg",
    lat: 12.9716,
    lng: 77.5946
  },
  {
    name: "Kuchipudi",
    aspect: "Classical Dance",
    description: "Dance-drama from Andhra Pradesh blending quick footwork, abhinaya, and character-driven storytelling.",
    img: "https://images.pexels.com/photos/18240707/pexels-photo-18240707.jpeg",
    lat: 16.5062,
    lng: 80.648
  },
  {
    name: "Mohiniyattam",
    aspect: "Classical Dance",
    description: "Graceful solo dance from Kerala emphasizing lasya (soft movements) and lyrical expression.",
    img: "https://images.pexels.com/photos/30444651/pexels-photo-30444651.jpeg",
    lat: 10.8505,
    lng: 76.2711
  },
  {
    name: "Yoga and Ayurveda",
    aspect: "Wellness",
    description: "Ancient body-mind practices and holistic medicine systems rooted in South Indian tradition and ashrams.",
    img: "https://i0.wp.com/powercutonline.com/wp-content/uploads/2025/07/Jnana-Yoga-Basics-optimized.webp?w=1280&ssl=1",
    lat: 30.3165,
    lng: 78.0322
  },
  {
    name: "Tanjore Painting",
    aspect: "Visual Art",
    description: "Gold-foil embellished devotional art from Thanjavur featuring rich colors and relief work.",
    img: "https://poompuhar.com/wp-content/uploads/2024/09/DSC05347-1.png",
    lat: 10.7905,
    lng: 79.1372
  },
  {
    name: "Mysore Painting",
    aspect: "Visual Art",
    description: "Karnataka style noted for delicate lines, muted palettes, and gesso relief halos in mythological themes.",
    img: "https://poompuhar.com/wp-content/uploads/2024/09/DSC05347-1.png",
    lat: 12.2958,
    lng: 76.6394
  },
  {
    name: "Traditional Textiles",
    aspect: "Craft",
    description: "Handloom heritage like Kanjivaram, Ilkal, and Pochampally weaving, showcasing South Indian textile mastery.",
    img: "https://images.pexels.com/photos/34996132/pexels-photo-34996132.jpeg",
    lat: 26.9124,
    lng: 75.7873
  },
];

const filterCategories = [
  { label: "All Types", value: "all" },
  { label: "Festivals", value: "festival" },
  { label: "Cultures", value: "culture" },
  { label: "Historical Places", value: "historical" },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];
const getNextMonthName = () => {
  const nextMonthIndex = (new Date().getMonth() + 1) % 12;
  return months[nextMonthIndex];
};

type FestivalDataType = typeof festivalsData;
type CultureType = typeof culturalHighlights[0] & { id: number; cardType: "culture" };
type HistoricalType = typeof historicalPlaces[0] & { cardType: "historical"; lat?: number; lng?: number; location?: string; description?: string; era?: string };
type CardType = (typeof festivalsData[0] & { cardType: "festival" }) | CultureType | HistoricalType;

// --- Map FlyTo function ---
const FlyToLocation = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 6);
  }, [position, map]);
return null;
};

const NextMonthHighlight = ({ festivalsData }: { festivalsData: FestivalDataType }) => {
  const nextMonthName = getNextMonthName();
  const nextMonthFestivals = useMemo(
    () => festivalsData.filter(f => f.month.includes(nextMonthName)),
    [nextMonthName, festivalsData]
  );
  if (nextMonthFestivals.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-orange-50/80 backdrop-blur-sm border-l-4 border-orange-500 p-6 mb-12 rounded-xl shadow-sm flex items-center gap-4 max-w-4xl mx-auto"
      >
        <div className="p-3 bg-orange-100 rounded-full">
          <TrendingUp size={24} className="text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-orange-900">Next Month ({nextMonthName})</h3>
          <p className="text-orange-800/80">No major events scheduled yet. Check back for updates!</p>
        </div>
      </motion.div>
    );
  }
  const festivalNames = nextMonthFestivals.map(f => f.name).join(', ');
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 mb-12 rounded-2xl shadow-lg flex items-start gap-4 max-w-4xl mx-auto relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      <div className="p-3 bg-emerald-100 rounded-full z-10">
        <TrendingUp size={24} className="text-emerald-600" />
      </div>
      <div className='flex-grow z-10'>
        <p className="text-sm font-bold text-emerald-600 tracking-wider uppercase mb-1">
          ✨ Upcoming Events - {nextMonthName}
        </p>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Don't miss: <span className="text-emerald-700">{festivalNames}</span>
        </h3>
        <p className="text-gray-600 text-sm">Plan your travels now to witness these spectacular celebrations.</p>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
const Festivals = () => {
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [upcomingFilter, setUpcomingFilter] = useState<'none' | 'next_month' | 'current_month'>('none');
  const [showMore, setShowMore] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [showLiveLocation] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // For the unified button dropdown
  const cardsSectionRef = useRef<HTMLDivElement | null>(null);

  // Create cards for all types
  const allCards: CardType[] = [
    ...festivalsData.map(f => ({ ...f, cardType: "festival" as const })),
    ...culturalHighlights.map((f, i) => ({ ...f, cardType: "culture" as const, id: 1000 + i })),
    ...historicalPlaces.map((f, i) => ({ ...f, cardType: "historical" as const, id: 2000 + i })),
  ] as CardType[];

  // --- SEARCH & FILTER HOOK ---
  const filteredCards = useMemo(() => {
    let cards = allCards;

    // 1. Type Filter
    if (filterType !== 'all') cards = cards.filter(card => card.cardType === filterType);
    
    // 2. Month Filter
    if (selectedMonth !== 'All Months') {
      cards = cards.filter(card => 'month' in card && card.month.includes(selectedMonth));
    }

    // 3. Upcoming Filter
    if (upcomingFilter === 'next_month') {
      const next = getNextMonthName();
      cards = cards.filter(card => 'month' in card && card.month.includes(next));
    } else if (upcomingFilter === 'current_month') {
      const current = months[new Date().getMonth()];
      cards = cards.filter(card => 'month' in card && card.month.includes(current));
    }

    // 4. Search Text
    if (searchText.trim()) {
      return cards.filter(card =>
        card.name.toLowerCase().includes(searchText.toLowerCase()) ||
        ('location' in card && card.location && card.location.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    return cards;
  }, [filterType, searchText, selectedMonth, upcomingFilter, allCards]);

  const showCards = showMore ? filteredCards : filteredCards.slice(0, 6);
  const highlightedCard = selectedCard || filteredCards[0];

  useEffect(() => { setSelectedCard(null); }, [showMap, filterType]);

  const focusFestivals = () => {
    setFilterType('festival');
    setShowMap(false);
    setShowMore(true);
    setIsFilterOpen(false);
    requestAnimationFrame(() => {
      cardsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };



  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* HERO SECTION */}
      <div className="relative bg-stone-900 h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <img 
            src="https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg" 
            alt="Indian Culture" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tight"
          >
            Cultural Odyssey
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-stone-200 font-light mb-8"
          >
            Immerse yourself in the vibrant colors of Indian festivals, heritage, and history.
          </motion.p>
          
          {/* SEARCH BAR IN HERO */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 flex items-center max-w-xl mx-auto shadow-2xl"
          >
            <Search className="text-white/70 ml-4 w-5 h-5" />
            <input
              type="text"
              placeholder="Search festivals, places, culture..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="bg-transparent border-none outline-none text-white placeholder-white/60 px-4 py-2 flex-grow w-full"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <NextMonthHighlight festivalsData={festivalsData} />

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white shadow-sm border border-stone-200 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Calendar size={20} />
            </div>
            <p className="text-stone-800 text-base leading-relaxed">
              Get recommendations for <span className="font-semibold">festivals/events</span> happening during your visit and the best places to experience them.
            </p>
          </div>
          <button
            onClick={focusFestivals}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow hover:shadow-md transition"
          >
            Focus on festivals
            <ChevronRight size={16} className="opacity-90" />
          </button>
        </motion.div>

        {/* CONTROLS BAR */}
        <div ref={cardsSectionRef} className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-10">
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* UNIFIED FILTER BUTTON */}
            <div className="relative z-30">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-5 py-2.5 bg-white border border-stone-200 rounded-xl shadow-sm font-medium text-stone-700 flex items-center gap-2 min-w-[180px] justify-between hover:bg-stone-50 transition-all"
              >
                <span className="capitalize">{filterCategories.find(c => c.value === filterType)?.label}</span>
                <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden"
                  >
                    {filterCategories.map(cat => (
                      <button
                        key={cat.value}
                        className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-stone-50 transition-colors flex items-center justify-between ${
                          filterType === cat.value ? 'bg-stone-50 text-stone-900' : 'text-stone-600'
                        }`}
                        onClick={() => { 
                          setFilterType(cat.value); 
                          setIsFilterOpen(false); 
                          setShowMore(false); 
                        }}
                      >
                        {cat.label}
                        {filterType === cat.value && <div className="w-2 h-2 rounded-full bg-teal-500"></div>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MONTH SELECTION */}
            <div className="relative group z-20">
              <select
                value={selectedMonth}
                onChange={(e) => { setSelectedMonth(e.target.value); setUpcomingFilter('none'); }}
                className="appearance-none px-5 py-2.5 bg-white border border-stone-200 rounded-xl shadow-sm font-medium text-stone-700 pr-10 hover:bg-stone-50 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-stone-200"
              >
                <option value="All Months">All Months</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>

            {/* UPCOMING BUTTONS */}
            <div className="flex bg-white rounded-xl border border-stone-200 p-1">
              <button
                onClick={() => { setUpcomingFilter(upcomingFilter === 'next_month' ? 'none' : 'next_month'); setSelectedMonth('All Months'); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  upcomingFilter === 'next_month' ? 'bg-teal-50 text-teal-700' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <TrendingUp size={14} /> Next Month
              </button>
              <button
                onClick={() => { setUpcomingFilter(upcomingFilter === 'current_month' ? 'none' : 'current_month'); setSelectedMonth('All Months'); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  upcomingFilter === 'current_month' ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Clock size={14} /> This Month
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 w-full xl:w-auto justify-end">
            <button
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                showLiveLocation ? 'bg-teal-600 text-white shadow-lg shadow-teal-200' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
              onClick={() => setShowLiveLocation(x => !x)}
            >
              <Share2 size={16} /> Live Location
            </button>
            
            <div className="bg-white p-1 rounded-xl border border-stone-200 flex">
              <button
                onClick={() => setShowMap(false)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${!showMap ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
              >
                <Grid size={16} /> List
              </button>
              <button
                onClick={() => setShowMap(true)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${showMap ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
              >
                <MapIcon size={16} /> Map
              </button>
            </div>
          </div>
        </div>

        {/* LIST OR MAP VIEW */}
        {!showMap ? (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {showCards.map((card, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    key={card.id || card.name}
                    className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
                    onMouseEnter={() => card.id && setHoveredCardId(card.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={card.img || 'https://placehold.co/500x300?text=Culture+or+Historical'}
                        alt={card.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = 'https://via.placeholder.com/500x300?text=Festival+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block ${
                          card.cardType === "festival" ? "bg-orange-500 text-white" :
                          card.cardType === "culture" ? "bg-purple-500 text-white" :
                          "bg-amber-600 text-white"
                        }`}>
                          {card.cardType === "festival" ? ('type' in card ? card.type.split(' ')[0] : "Festival")
                            : card.cardType === "culture" ? ('aspect' in card ? card.aspect : "Culture")
                            : "History"}
                        </span>
                        <h3 className="text-xl font-bold text-white font-serif leading-tight">{card.name}</h3>
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      {card.cardType === "festival" && (
                        <>
                          <div className="flex items-center gap-4 text-xs font-medium text-stone-500 mb-4">
                            <span className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-md"><Calendar size={14} className="text-teal-600" /> {card.month}</span>
                            <span className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-md"><MapPin size={14} className="text-red-500" /> {card.location}</span>
                          </div>
                          <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-4">{card.desc}</p>
                        </>
                      )}
                      {card.cardType === "culture" && (
                        <p className="text-stone-600 text-sm leading-relaxed line-clamp-4 mb-4">{card.description}</p>
                      )}
                      {card.cardType === "historical" && (
                        <>
                          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-3">
                            <span className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-md"><MapPin size={14} className="text-red-500" /> {card.location}</span>
                          </div>
                          <p className="text-stone-600 text-sm leading-relaxed line-clamp-3 mb-4">{card.description}</p>
                        </>
                      )}
                      
                      <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Read More</span>
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {filteredCards.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowMore(prev => !prev)}
                  className="px-8 py-3 bg-white border border-stone-200 text-stone-800 rounded-full shadow-sm font-bold hover:bg-stone-50 hover:shadow-md transition-all transform hover:-translate-y-1"
                >
                  {showMore ? "Show Less" : "Discover More"}
                </button>
              </div>
            )}
          </>
        ) : (
          // --- MAP VIEW ---
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-[600px] rounded-3xl flex flex-col border border-stone-200 overflow-hidden shadow-2xl relative"
          >
            <Map location="India" />
          </motion.div>
        )}
      </div>

      {/* CARD DETAIL MODAL */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedCard?.img || 'https://placehold.co/500x300?text=Culture+or+Historical'}
                  className="w-full h-full object-cover"
                  alt={selectedCard?.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-2">{selectedCard?.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedCard?.cardType === "festival" && (
                      <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm border border-white/30">
                        {selectedCard.type}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCard(null)} 
                  className="absolute top-4 right-4 bg-black/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/40 transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {selectedCard?.cardType === "festival" && (
                    <>
                      <div className="bg-stone-50 p-4 rounded-xl">
                        <span className="text-xs font-bold text-stone-400 uppercase block mb-1">When</span>
                        <span className="font-medium text-stone-800">{selectedCard.month}</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-xl col-span-2">
                        <span className="text-xs font-bold text-stone-400 uppercase block mb-1">Where</span>
                        <span className="font-medium text-stone-800">{selectedCard.location}</span>
                      </div>
                    </>
                  )}
                  {selectedCard?.cardType === "historical" && (
                    <>
                      <div className="bg-stone-50 p-4 rounded-xl">
                        <span className="text-xs font-bold text-stone-400 uppercase block mb-1">Era</span>
                        <span className="font-medium text-stone-800">{selectedCard.era}</span>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-xl col-span-2">
                        <span className="text-xs font-bold text-stone-400 uppercase block mb-1">Location</span>
                        <span className="font-medium text-stone-800">{selectedCard.location}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="prose prose-stone max-w-none">
                  <h3 className="text-xl font-bold text-stone-900 mb-4">About</h3>
                  <p className="text-stone-600 leading-relaxed text-lg">
                    {selectedCard?.cardType === "festival" ? selectedCard.desc :
                     selectedCard?.cardType === "culture" ? selectedCard.description :
                     selectedCard?.cardType === "historical" ? selectedCard.description : ""}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-stone-100 flex justify-between items-center">
                  <button className="text-stone-500 hover:text-stone-800 font-medium text-sm flex items-center gap-2">
                    <Share2 size={16} /> Share
                  </button>
                  <button 
                    onClick={() => setSelectedCard(null)}
                    className="px-6 py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition shadow-lg shadow-stone-200"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Festivals;
