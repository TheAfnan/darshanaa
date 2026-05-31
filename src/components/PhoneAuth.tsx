import React, { useEffect, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";

const PhoneAuth: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // render invisible recaptcha once
    if (!window || !(window as any).grecaptcha) {
      try {
        (auth as any); // noop to keep TS happy
      } catch (e) {}
    }
  }, []);

  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) return (window as any).recaptchaVerifier;

    const verifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );

    (window as any).recaptchaVerifier = verifier;
    return verifier;
  };

  const sendOtp = async () => {
    setMessage("");
    if (!phone) {
      setMessage("Enter phone number with country code, e.g. +911234567890");
      return;
    }

    setLoading(true);
    try {
      const verifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(result);
      setMessage("OTP sent. Check your messages.");
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!confirmationResult) {
      setMessage("No OTP request in progress");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(code);
      const idToken = await userCredential.user.getIdToken();
      setMessage("Phone sign-in successful");
      // TODO: send idToken to backend or set app auth state
      console.log("ID Token:", idToken);
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div id="recaptcha-container" />

      <div className="space-y-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+911234567890"
          className="w-full px-3 py-2 border rounded-md text-sm"
        />

        <button
          type="button"
          onClick={sendOtp}
          className="w-full bg-orange-500 text-white py-2 rounded-md text-sm"
          disabled={loading}
        >
          {loading ? "Sending…" : "Send OTP"}
        </button>

        {confirmationResult && (
          <div className="mt-2 space-y-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />

            <button
              type="button"
              onClick={verifyCode}
              className="w-full bg-green-600 text-white py-2 rounded-md text-sm"
              disabled={loading}
            >
              {loading ? "Verifying…" : "Verify OTP"}
            </button>
          </div>
        )}

        {message && <div className="text-xs text-gray-600 mt-2">{message}</div>}
      </div>
    </div>
  );
};

export default PhoneAuth;
