import express from "express";
import Event from "../models/Event.js";
import Ticket from "../models/Ticket.js";
import crypto from "crypto";
import QRCode from "qrcode";

const router = express.Router();

// Show ticket purchase page
router.get("/buy-ticket/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send("Event not found");

        res.render("buy-ticket", { event });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).send("Server error");
    }
});

// Generate ticket after payment
router.get("/generate-ticket/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send("Event not found");

        const { name, email } = req.query;

        const ticketCode = crypto.randomBytes(6).toString("hex").toUpperCase();
        const ticketData = `${name} | ${email} | ${ticketCode}`;

        // Generate QR Code
        const qrCode = await QRCode.toDataURL(ticketData);

        const newTicket = new Ticket({
            eventId: event._id,
            buyerName: name,
            buyerEmail: email,
            ticketCode,
        });

        await newTicket.save();

        res.render("ticket-confirmation", { ticket: newTicket, event, qrCode });
    } catch (error) {
        console.error("Error generating ticket:", error);
        res.status(500).send("Server error");
    }
});

export default router;
