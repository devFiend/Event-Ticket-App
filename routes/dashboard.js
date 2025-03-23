import express from "express";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode"; // Import QRCode library

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory where ticket PDFs and QR codes will be saved
const ticketsDir = path.join(process.cwd(), 'tickets');

// Check if the directory exists, if not, create it
if (!fs.existsSync(ticketsDir)) {
    fs.mkdirSync(ticketsDir, { recursive: true });
}

const router = express.Router();

// Dashboard Route
router.get("/dashboard", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).send("Email is required");

        const tickets = await Ticket.find({ buyerEmail: email }).populate("eventId");

        res.render("dashboard", { tickets, email });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).send("Server error");
    }
});

// Generate and Download Ticket as PDF
router.get("/dashboard/download-ticket/:ticketId", async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId).populate("eventId");
        if (!ticket) return res.status(404).send("Ticket not found");

        const filePath = path.join(ticketsDir, `${ticket.ticketCode}.pdf`);
        const qrImagePath = path.join(ticketsDir, `${ticket.ticketCode}.png`);

        console.log("Ticket found:", ticket);
        console.log("Generating QR for ticket code:", ticket.ticketCode);

        // Generate QR Code
        const qrData = `Event: ${ticket.eventId.title}\nDate: ${ticket.eventId.date}\nTicket Code: ${ticket.ticketCode}\nBuyer: ${ticket.buyerName}`;
        await QRCode.toFile(qrImagePath, qrData);
        console.log("QR Code generated:", qrImagePath);

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // 🎟️ Header
        doc.font("Helvetica-Bold").fontSize(24).text("🎟️ Event Ticket", { align: "center" }).moveDown();
        doc.fontSize(18).text(ticket.eventId.title, { align: "center" }).moveDown();

        // 📅 Ticket Details
        doc.font("Helvetica").fontSize(14);
        doc.text(`📆 Date: ${ticket.eventId.date}`);
        doc.text(`🆔 Ticket Code: ${ticket.ticketCode}`);
        doc.text(`👤 Buyer: ${ticket.buyerName}`);
        doc.text(`📧 Email: ${ticket.buyerEmail}`).moveDown();

        // 🖼️ QR Code
        doc.image(qrImagePath, { width: 150, align: "center" });
        console.log("Added QR Code to PDF");

        doc.end();

        stream.on("finish", () => {
            console.log("PDF generation finished, starting download...");
            res.download(filePath, (err) => {
                if (err) {
                    console.error("Error downloading ticket:", err);
                    return;
                }
                console.log("File sent, cleaning up...");
                fs.unlinkSync(filePath); // Cleanup PDF
                fs.unlinkSync(qrImagePath); // Cleanup QR Code
            });
        });
    } catch (error) {
        console.error("Error generating ticket:", error);
        res.status(500).send("Server error");
    }
});

export default router;
