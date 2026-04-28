// create an express server with cors and connect to MongoDB using mongoose. Also create a test route to check if the server is running.
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/", require("./routes/urlRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});