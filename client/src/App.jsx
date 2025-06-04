import { useState } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendOTP() {
    try {
      setIsLoading(true);
      setStatus("");

      const res = await fetch("http://localhost:5000/api/wati/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setStatus("OTP sent successfully! Check your WhatsApp.");
        setShowOtpInput(true);
      } else {
        setStatus("Failed to send OTP: " + (data.error || data.details || JSON.stringify(data)));
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP() {
    try {
      setIsLoading(true);
      setStatus("");

      const res = await fetch("http://localhost:5000/api/wati/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        setStatus("Successfully verified!");
      } else {
        setStatus("Verification failed: " + (data.error || data.details || JSON.stringify(data)));
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setPhoneNumber("");
    setOtp("");
    setShowOtpInput(false);
    setStatus("");
  }

  async function testWatiConnection() {
    try {
      const res = await fetch("http://localhost:5000/api/wati/test-connection");
      const data = await res.json();
      console.log('Wati connection test:', data);
      setStatus(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Wati connection test failed:', err);
      setStatus("Error testing connection: " + err.message);
    }
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>WhatsApp Authentication</h1>
      {!isLoggedIn ? (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter WhatsApp number (with country code)"
              style={{
                padding: "10px",
                width: "100%",
                fontSize: "16px",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc"
              }}
            />
            {!showOtpInput ? (
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  backgroundColor: isLoading ? "#cccccc" : "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  width: "100%"
                }}
              >
                {isLoading ? "Sending..." : "Send OTP via WhatsApp"}
              </button>
            ) : (
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  style={{
                    padding: "10px",
                    width: "100%",
                    fontSize: "16px",
                    marginBottom: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                />
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    backgroundColor: isLoading ? "#cccccc" : "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    width: "100%"
                  }}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2>Welcome!</h2>
          <p>You are successfully logged in with WhatsApp.</p>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginTop: "20px",
              width: "100%"
            }}
          >
            Logout
          </button>
        </div>
      )}
      {status && (
        <p style={{ 
          marginTop: "20px", 
          padding: "10px",
          backgroundColor: status.includes("Error") || status.includes("Failed") ? "#ffebee" : "#e8f5e9",
          borderRadius: "4px",
          color: status.includes("Error") || status.includes("Failed") ? "#c62828" : "#2e7d32"
        }}>
          {status}
        </p>
      )}
    </div>
  );
}

export default App;
