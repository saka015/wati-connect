const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const WATI_ACCESS_TOKEN = process.env.WATI_ACCESS_TOKEN;
console.log(WATI_ACCESS_TOKEN);
const WATI_API_ENDPOINT =
    process.env.WATI_API_ENDPOINT || "https://live-server.wati.io";

const otpStore = new Map();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters and ensure it starts with country code
    return phoneNumber.replace(/[^0-9]/g, "");
}

router.post("/login", async(req, res) => {
    try {
        const response = await axios.get(`${WATI_API_ENDPOINT}/api/v1/me`, {
            headers: {
                Authorization: `Bearer ${WATI_ACCESS_TOKEN}`,
            },
        });

        res.json({
            success: true,
            data: response.data,
            token: WATI_ACCESS_TOKEN,
        });
    } catch (error) {
        console.error("Login error:", error.response.data || error.message);

        if (error.response.status === 401) {
            return res.status(401).json({ error: "Invalid WATI access token" });
        }

        res.status(500).json({ error: "Something went wrong" });
    }
});

router.get("/auth-test", async(req, res) => {
    try {
        const response = await axios.get(`${WATI_API_ENDPOINT}/api/v1/me`, {
            headers: {
                Authorization: `Bearer ${WATI_ACCESS_TOKEN}`,
            },
        });

        // If token valid, return user info
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Auth test error:", error.response.data || error.message);

        // If WATI says unauthorized, send 401
        if (error.response.status === 401) {
            return res
                .status(401)
                .json({ error: "Unauthorized - Invalid WATI access token" });
        }

        res.status(500).json({ error: "Something went wrong" });
    }
});

router.post("/send-otp", async(req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        const formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");
        const otp = generateOTP();

        otpStore.set(formattedPhoneNumber, {
            code: otp,
            timestamp: Date.now(),
        });

        const messageText = `Your verification code is: ${otp}. This code will expire in 5 minutes.`;
        const url = `${WATI_API_ENDPOINT}/api/v1/sendSessionMessage/${formattedPhoneNumber}?messageText=${encodeURIComponent(
      messageText
    )}`;

        const response = await axios.post(
            url, {}, // empty body as parameters are in URL
            {
                headers: {
                    Authorization: `Bearer ${WATI_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Wati API Response:", response.data);
        res.json({
            success: true,
            message: "OTP sent successfully",
            phoneNumber: formattedPhoneNumber,
        });
    } catch (error) {
        console.error("Send OTP error details:", {
            message: error.message,
            response: error.response.data,
            status: error.response.status,
        });

        if (error.response.status === 401) {
            return res.status(401).json({
                error: "Invalid WATI access token",
                details: error.response.data || "Authentication failed",
            });
        }

        if (error.response.status === 404) {
            return res.status(404).json({
                error: "Wati API endpoint not found",
                details: `API endpoint not found. Please check your configuration.`,
            });
        }

        res.status(500).json({
            error: "Failed to send OTP",
            details: error.response.data || error.message,
        });
    }
});

router.post("/verify-otp", async(req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        if (!phoneNumber || !otp) {
            return res
                .status(400)
                .json({ error: "Phone number and OTP are required" });
        }

        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        const storedData = otpStore.get(formattedPhoneNumber);

        if (!storedData) {
            return res.status(400).json({ error: "No OTP found for this number" });
        }

        const isExpired = Date.now() - storedData.timestamp > 5 * 60 * 1000; // 5 minutes
        if (isExpired) {
            otpStore.delete(formattedPhoneNumber);
            return res.status(400).json({ error: "OTP has expired" });
        }

        if (storedData.code !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Clear the OTP after successful verification
        otpStore.delete(formattedPhoneNumber);

        res.json({
            success: true,
            message: "OTP verified successfully",
        });
    } catch (error) {
        console.error("Verify OTP error:", error.response.data || error.message);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
});

router.get("/test-connection", async(req, res) => {
    try {
        console.log("Testing Wati connection with token:", WATI_ACCESS_TOKEN);

        const response = await axios.get(`${WATI_API_ENDPOINT}/api/v1/me`, {
            headers: {
                Authorization: `Bearer ${WATI_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Wati API Response:", response.data);
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Wati connection test error:", {
            message: error.message,
            response: error.response.data,
            status: error.response.status,
        });

        res.status(500).json({
            error: "Failed to connect to Wati",
            details: error.response.data || error.message,
        });
    }
});

module.exports = router;