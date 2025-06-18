const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.password !== password) return res.status(400).json({ message: "Incorrect password" });

    res.status(200).json({
      message: "Login success",
      name: user.name,
      email: user.email // ✅ Send back email
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//measurement 
router.post("/manual-measurement", async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });

    const measurement = {
      ...req.body,
      date: req.body.date || new Date()
    };

    user.measurements.push(measurement);
    await user.save();

    res.status(200).json({ message: "Measurement saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Measurement History Route
router.get("/measurements/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.measurements) {
      return res.status(404).json({ message: "No measurements found" });
    }

    res.status(200).json(user.measurements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//ai-image-measurement
router.post("/save-ai-measurement", async (req, res) => {
  // Destructure all expected measurement fields from req.body
  const {
    email,
    type,
    chest,
    waist,
    height,
    shoulder,
    sleeve_length,
    stomach,
    neck,
    pant_length,
    hips,
    bottom,
    seat_round,
    date
  } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create the measurement object with all fields
    const aiMeasurement = {
      type: type || "ai",
      chest,
      waist,
      height,
      // Add all new fields here
      shoulder,
      sleeve_length,
      stomach,
      neck,
      pant_length,
      hips,
      bottom,
      seat_round,
      date: date || new Date() // Use provided date or current date
    };
    user.measurements.push(aiMeasurement);
    await user.save();
    res.status(200).json({ message: "AI measurement saved successfully" });
  } catch (err) {
    console.error("Error saving AI measurement:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//save-fit-score
router.post("/save-fit-score", async (req, res) => {
  const { email, type, fitScore } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    // find latest measurement of that type
    const index = [...user.measurements].reverse().findIndex(m => m.type === type);
    if (index === -1) return res.status(404).json({ message: "Measurement not found" });
    // calculate actual index from reverse
    const realIndex = user.measurements.length - 1 - index;
    user.measurements[realIndex].fitScore = fitScore;
    await user.save();
    res.status(200).json({ message: "Fit score saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//save an outfit
router.post("/save-outfit", async (req, res) => {
  const { email, type, fitScore } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.closet.push({ type, fitScore, date: new Date() });  // <-- Potential error here
    await user.save();
    res.status(200).json({ message: "Outfit saved!" });
  } catch (err) {
    console.error("Error saving outfit:", err); // 👈 see the real issue in terminal
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/closet/:email
router.get("/closet/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.closet) {
      return res.status(404).json({ message: "No outfits found" });
    }
    res.status(200).json(user.closet);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//delete a saved outfit 
router.delete("/closet/:email/:id", async (req, res) => {
  const { email, id } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.closet = user.closet.filter((entry) => entry._id.toString() !== id);
    await user.save();
    res.status(200).json({ message: "Outfit deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Save style recommendation
router.post("/save-style", async (req, res) => {
  const { email, type, fitScore, styleCategory, tips } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.styles) user.styles = []; // make sure styles exists
    user.styles.push({
      type,
      fitScore,
      styleCategory,
      tips,
      date: new Date()
    });
    await user.save();
    res.status(200).json({ message: "Style saved successfully" });
  } catch (err) {
    console.error("Error saving style:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//save customization
router.post("/save-customization", async (req, res) => {
  const { email, type, fabric, color, design } = req.body;
  console.log("▶️ Received POST to /save-customization");
  console.log("📩 Email received:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found with email:", email);
      return res.status(404).json({ message: "User not found" });
    }
    const customization = { type, fabric, color, design, date: new Date() };
    if (!user.customizations) {
      user.customizations = [];
    }
    user.customizations.push(customization);
    await user.save();
    res.status(200).json({ message: "Customization saved!" });
  } catch (err) {
    console.error("Error saving customization:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Place Order Simulation Route
router.post("/place-order", async (req, res) => {
  const { email, type, fabric, color, design } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const order = {
      type,
      fabric,
      color,
      design,
      date: new Date()
    };
    if (!user.orders) user.orders = []; // Ensure array exists
    user.orders.push(order);
    await user.save();
    res.status(200).json({ message: "Order placed!" });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ View Orders
router.get("/orders/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.orders) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json(user.orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;