require("dotenv").config();
const express = require("express");
const cors = require("cors");
const watiAuthRoutes = require("./routes/wati.route");

const app = express();

// Allow only your frontend URL to access backend
app.use(
    cors({
        origin: "http://localhost:5173", // <-- your frontend URL here
        credentials: true, // if you want to send cookies/auth headers
    })
);

app.use(express.json());

app.use("/api/wati", watiAuthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});