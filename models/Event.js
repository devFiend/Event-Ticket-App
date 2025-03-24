import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String } // Store image path
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
