import express from "express";
import Event from "../models/Event.js";

const router = express.Router();

// Show mock payment page
router.post("/mock-payment/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send("Event not found");

        const { buyerName, buyerEmail } = req.body;

        res.render("mock-payment", { event, buyerName, buyerEmail });
    } catch (error) {
        console.error("Error loading payment page:", error);
        res.status(500).send("Server error");
    }
});

// Handle mock payment confirmation
router.post("/confirm-payment/:id", async (req, res) => {
    try {
        const { buyerName, buyerEmail } = req.body;
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send("Event not found");

        // Simulate a successful payment
        res.redirect(`/tickets/generate-ticket/${event._id}?name=${buyerName}&email=${buyerEmail}`);
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).send("Server error");
    }
});

export default router;
