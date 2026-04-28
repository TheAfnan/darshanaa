import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

// Auth Components
import { GuestOnly, RequireAuth } from "./components/Auth/ProtectedRoute";

// Pages
import LoginOverlay from "./components/Auth/LoginOverlay";
import BecomeGuide from "./components/Guide/BecomeGuide";
import SafetyModal from "./components/SafetyModal";
import YatraShayak from "./components/YatraShayak";
import AdminDashboard from "./pages/AdminDashboard";
import AllCities from "./pages/AllCities";
import Assistant from "./pages/Assistant";
import Booking from "./pages/Booking";
import EcoRewardsDashboard from "./pages/EcoRewardsDashboard";
import FestivalAlerts from "./pages/FestivalAlerts";
import Festivals from "./pages/Festivals";
import ForgotPassword from "./pages/ForgotPassword";
import GreenRoutePlanner from "./pages/GreenRoutePlanner";
import GuideListing from "./pages/GuideListing";
import Home from "./pages/Home";
import LanguageSelector from "./pages/LanguageSelector";
import LocalGuideDashboard from "./pages/LocalGuideDashboard";
import Login from "./pages/Login";
import Lucknow from "./pages/Lucknow";
import MoodAnalyzer from "./pages/MoodAnalyzer";
import MyTrips from "./pages/MyTrips";
import NotAuthorized from "./pages/NotAuthorized";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import SafetyDashboard from "./pages/SafetyDashboard";
import SafetyGuide from "./pages/SafetyGuide";
import Sustainable from "./pages/Sustainable";
import TravelEssentials from "./pages/TravelEssentials";
import TravelHub from "./pages/TravelHub"; // ✔️ Correct Import
import UIStyleGuide from "./pages/UIStyleGuide";


// Auto scroll to top when route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [isSafetyOpen, setIsSafetyOpen] = React.useState(false);

  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />

        {/* Page Wrapper */}
        <div className="min-h-screen flex flex-col bg-primary-50 text-primary-900 font-sans">

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-grow pt-20 sm:pt-24">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/home" element={<Home />} />
            <Route path="/mood" element={<MoodAnalyzer />} />
            <Route path="/travelhub" element={<TravelHub />} />
            <Route path="/cities" element={<AllCities />} />
            <Route path="/city/lucknow" element={<Lucknow />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/sustainable" element={<Sustainable />} />
            <Route path="/green-route-planner" element={<GreenRoutePlanner />} />
            <Route path="/safety" element={<SafetyDashboard />} />
            <Route path="/safety-guide" element={<SafetyGuide />} />
            <Route path="/travel-essentials" element={<TravelEssentials />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/festival-alerts" element={<FestivalAlerts />} />
            <Route path="/language" element={<LanguageSelector />} />
            <Route path="/guides" element={<GuideListing />} />
            <Route path="/style-guide" element={<UIStyleGuide />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />
            
            {/* Guest Only Routes (redirect if logged in) */}
            <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
            <Route path="/reset-password/:token" element={<GuestOnly><ResetPassword /></GuestOnly>} />
            
            {/* Protected Routes (require authentication) */}
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/my-trips" element={<RequireAuth><MyTrips /></RequireAuth>} />
            <Route path="/rewards" element={<RequireAuth><EcoRewardsDashboard /></RequireAuth>} />
            <Route path="/become-guide" element={<BecomeGuide />} />
            <Route path="/guide-dashboard" element={<LocalGuideDashboard />} />
            <Route path="/booking" element={<Booking />} />
            
            {/* Admin Dashboard (public for now) */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        {/* Footer */}
        <Footer />
        <YatraShayak onSafetyClick={() => setIsSafetyOpen(true)} />
        <SpeedInsights />
        <Analytics />

        <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} />
        <LoginOverlay />

      </div>
    </HashRouter>
    </AuthProvider>
  );
};

export default App;
