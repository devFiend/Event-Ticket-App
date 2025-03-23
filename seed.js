import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/Event.js";

// ✅ Load environment variables
dotenv.config(); 

// ✅ Debugging: Check if MONGO_URI is loaded
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is undefined! Check your .env file.");
  process.exit(1); // Stop execution if MONGO_URI is missing
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => {
  console.error("DB Connection Error:", err);
  process.exit(1);
});

const seedEvents = async () => {
  try {
    await Event.deleteMany({}); // Clear existing events
    console.log("Existing events deleted.");

    const events = [
      { title: "Tech Conference 2025", date: "2025-06-10", price: 50, description: "A global tech meetup." },
      { title: "Gospel Music Festival", date: "2025-07-15", price: 30, description: "Live worship experience." },
      { title: "AI & Web3 Summit", date: "2025-08-22", price: 100, description: "The future of AI & Web3." }
    ];

    await Event.insertMany(events);
    console.log("Sample events added.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedEvents();
