import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// Admin page
router.get("/", (req, res) => {
    res.render("admin");
});

// Handle form submission
router.post("/add-event", async (req, res) => {
    try {
        const { title, date, price, description } = req.body;

        const newEvent = new Event({ title, date, price, description });
        await newEvent.save();

        res.redirect("/");
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).send("Server error");
    }
});

export default router;
