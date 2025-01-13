
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Owner from "../models/owner.js"; 

const router = express.Router();
const SECRET_KEY = "2e1len21lddkmdnklqwji92184bnk1j1lj1jtpib1utvdaskd"; 

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if the user already exists
    const existingUser = await Owner.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Owner({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await Owner.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Protected Route
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Fetch user details
    const user = await Owner.findById(decoded.id).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile fetched successfully.", user });
  } catch (error) {
    console.error("Profile route error:", error);
    res.status(401).json({ message: "Invalid token or access denied." });
  }
});

// Update Profile Route
router.put("/profile", async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const updateData = { name, email, phone, address };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update the user profile
    const updatedUser = await Owner.findByIdAndUpdate(req.user.id, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Delete Profile Route
router.delete("/profile", async (req, res) => {
  try {
    await Owner.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Profile deleted successfully." });
  } catch (error) {
    console.error("Profile delete error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
