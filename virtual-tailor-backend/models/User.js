
const mongoose = require("mongoose");

// Schema for measurements
const measurementSchema = new mongoose.Schema({
  type: String, // shirt or pant
  length: Number,
  shoulder: Number,
  sleeveLength: Number,
  chest: Number,
  stomach: Number,
  hips: Number,
  neck: Number,
  waist: Number,
  bottom: Number,
  seatRound: Number,
  date: Date,
  fitScore: Number
});

// Schema for saved outfits (closet)
const outfitSchema = new mongoose.Schema({
  type: { type: String }, // "shirt" or "pant"
  fitScore: Number,
  date: { type: Date, default: Date.now }
});

// Schema for saved style recommendations
const styleSchema = new mongoose.Schema({
  type: String,              // shirt or pant
  fitScore: Number,
  styleCategory: String,     // casual, office, party
  tips: [String],            // array of tips
  date: { type: Date, default: Date.now }
});

// Schema for customized clothing
const customizationSchema = new mongoose.Schema({
  type: String,
  fabric: String,
  color: String,
  design: String,
  date: { type: Date, default: Date.now }
});

// ✅ Schema for simulated orders
const orderSchema = new mongoose.Schema({
  type: String,
  fabric: String,
  color: String,
  design: String,
  date: { type: Date, default: Date.now }
});

// Main user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  measurements: [measurementSchema],
  closet: [outfitSchema],
  styles: [styleSchema],
  customizations: [customizationSchema],
  orders: [orderSchema]
});

module.exports = mongoose.model("User", userSchema);