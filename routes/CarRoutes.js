import express from "express";
import Car from "../models/car.js";

const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const { brand, model, year, registrationNumber, rentalPricePerDay, availability, features, location, images, owner } = req.body;

        const newCar = new Car({
            brand,
            model,
            year,
            registrationNumber,
            rentalPricePerDay,
            availability,
            features,
            location,
            images,
            owner, 
        });

        await newCar.save();
        res.status(201).json({ message: "Car added successfully", car: newCar });
    } catch (error) {
        res.status(500).json({ message: "Error adding car", error: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const cars = await Car.find().populate("owner", "name email");  // Populate owner details
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: "Error fetching cars", error: error.message });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate("owner", "name email");
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: "Error fetching car", error: error.message });
    }
});

// Update a car
router.put("/:id", async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Ensure only the car's owner can update it
        if (car.owner.toString() !== req.owner.id) {
            return res.status(403).json({ message: "You are not authorized to update this car" });
        }

        const updatedData = req.body;
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({ message: "Car updated successfully", car: updatedCar });
    } catch (error) {
        res.status(500).json({ message: "Error updating car", error: error.message });
    }
});

// Delete a car
router.delete("/:id", async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Ensure only the car's owner can delete it
        if (car.owner.toString() !== req.owner.id) {
            return res.status(403).json({ message: "You are not authorized to delete this car" });
        }

        await Car.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting car", error: error.message });
    }
});

// Get cars by owner
router.get("/owner/:ownerId", async (req, res) => {
    try {
        const cars = await Car.find({ owner: req.params.ownerId }).populate("owner", "name email");
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: "Error fetching owner's cars", error: error.message });
    }
});

// Update car availability
router.patch("/:id/availability", async (req, res) => {
    try {
        const { availability } = req.body;
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Ensure only the car's owner can update availability
        if (car.owner.toString() !== req.owner.id) {
            return res.status(403).json({ message: "You are not authorized to update this car's availability" });
        }

        car.availability = availability;
        await car.save();
        res.status(200).json({ message: "Car availability updated", car });
    } catch (error) {
        res.status(500).json({ message: "Error updating availability", error: error.message });
    }
});

export default router;
