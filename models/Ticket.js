import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    ticketCode: { type: String, required: true, unique: true },
    qrCode: { type: String }, // Store QR Code as a base64 image
});

export default mongoose.model("Ticket", TicketSchema);
