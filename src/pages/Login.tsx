import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ArrowRight, Lock, Mail, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import PhoneAuth from "../components/PhoneAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase.config.ts";
import loginImage from "../images/image-login-desh.jpg";
import { sendSignupEmail } from "../services/emailService";

interface LoginProps {
  onClose?: () => void;
  isModal?: boolean;
}

const Login: React.FC<LoginProps> = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, setAuth } = useAuth();

  const [isLoginView, setIsLoginView] = useState(true);
  const [loginStep, setLoginStep] = useState(1);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);

  // Switch view based on URL
  useEffect(() => {
    if (
      location.pathname.toLowerCase() === "/register" ||
      location.state?.view === "signup"
    ) {
      setIsLoginView(false);
      setLoginStep(1);
    } else {
      setIsLoginView(true);
      setLoginStep(1);
    }
  }, [location.pathname, location.state]);

  const handleLoginStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setError("Enter email or mobile number");
      return;
    }
    setError("");
    setLoginStep(2);
  };

  const handleLoginFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);

      if (loginEmail === 'admin@darshana.com') {
        navigate('/admin');
        if (onClose) onClose();
      } else {
        if (onClose) onClose(); // Close modal
        else navigate("/travelhub");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError("Name, email, and password are required");
      return;
    }

    if (!signupEmail.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register(signupName, signupEmail, signupEmail, signupPassword);

      // Fire-and-forget welcome email; do not block UI on failure
      void sendSignupEmail({ name: signupName, email: signupEmail });

      if (onClose) onClose();
      else navigate("/travelhub");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const googleUser = {
        id: result.user.uid,
        name: result.user.displayName || "Traveler",
        email: result.user.email || "",
        profileImage: result.user.photoURL || "",
        role: 'user' as const,
      };

      setAuth(idToken, googleUser);
      if (onClose) onClose();
      else navigate("/travelhub");
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose(); // Modal close
    else navigate("/"); // Full page close → go home
  };

  return (
    <div
      className={`${
        isModal
          ? "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          : "min-h-screen bg-orange-50/50"
      } flex items-center justify-center p-4`}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 relative
        ${isLoginView ? "w-[600px] h-[400px] md:flex-row" : "max-w-[380px]"}`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-gray-100 shadow-sm"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Left Illustration */}
        <div
          className={`relative bg-orange-100 transition-all duration-500 ${
            isLoginView ? "hidden md:block w-1/2" : "w-full h-40"
          }`}
        >
          <img
            src={loginImage}
            alt="Travel"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {isLoginView ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-12 text-white">
              <h2 className="text-4xl font-bold mb-4 font-serif">DarShana</h2>
              <p className="text-lg opacity-90">Discover India deeply.</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <h2 className="text-4xl font-bold font-serif text-white drop-shadow-lg">
                DarShana
              </h2>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div
          className={`flex flex-col justify-center transition-all duration-500 ${
            isLoginView ? "w-full md:w-1/2 p-6" : "w-full p-6"
          }`}
        >
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 font-serif mb-1">
                {isLoginView ? "Welcome Back" : "Create an Account"}
              </h2>
              <p className="text-gray-500 text-[10px]">
                {isLoginView ? "Login to continue" : "Start exploring India"}
              </p>
            </div>

            {/* Toggle */}
            {isLoginView && (
              <div className="flex bg-gray-100 p-1 rounded-full mb-4 relative">
                <div
                  className={`absolute w-1/2 h-full rounded-full bg-white shadow-sm transition-all ${
                    isLoginView ? "left-0" : "left-1/2"
                  }`}
                ></div>

                <button
                  onClick={() => {
                    setIsLoginView(true);
                    setLoginStep(1);
                    setError("");
                  }}
                  className={`flex-1 py-2.5 text-sm font-medium z-10 ${
                    isLoginView ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setIsLoginView(false);
                    setError("");
                  }}
                  className={`flex-1 py-2.5 text-sm font-medium z-10 ${
                    !isLoginView ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">
                {error}
              </div>
            )}

            {/* LOGIN FORM */}
            {isLoginView && (
              <div className="space-y-4">
                {loginStep === 1 ? (
                  <form onSubmit={handleLoginStep1} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email / Mobile Number
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none text-sm"
                          placeholder="Enter Email or Mobile"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    <button className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-sm">
                      Continue <ArrowRight size={16} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLoginFinal} className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs font-medium text-gray-700">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setLoginStep(1)}
                          className="text-[10px] text-orange-600"
                        >
                          Change Email
                        </button>
                      </div>

                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="password"
                          className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none text-sm"
                          placeholder="Password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-all text-sm"
                    >
                      {isLoading ? "Verifying..." : "Login"}
                    </button>
                  </form>
                )}

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-200 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-sm"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-4 h-4"
                  />
                  Sign in with Google
                </button>
                
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowPhoneAuth((s) => !s)}
                    className="w-full bg-white border border-gray-200 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 text-sm"
                  >
                    Sign in with SMS (OTP)
                  </button>
                </div>

                {showPhoneAuth && (
                  <div className="mt-4">
                    <PhoneAuth />
                  </div>
                )}
                <p className="text-center text-[10px] mt-2">
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLoginView(false)}
                    className="text-orange-600"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            )}

            {/* SIGNUP FORM */}
            {!isLoginView && (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-full text-sm"
                    placeholder="Full Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-full text-sm"
                    placeholder="Email / Phone"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-full text-sm"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-2.5 border rounded-full text-sm"
                    placeholder="Confirm Password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3 rounded-full font-bold hover:bg-orange-600 transition"
                >
                  {isLoading ? "Creating..." : "Sign Up"}
                </button>

                <p className="text-center text-xs mt-1">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLoginView(true)}
                    className="text-orange-600"
                  >
                    Login
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
