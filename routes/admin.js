import express from "express";
import Event from "../models/Event.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Admin page
router.get("/", (req, res) => {
    res.render("admin");
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: "public/uploads/", // Save images in 'public/uploads' folder
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file
    }
});

const upload = multer({ storage: storage });

// Handle event submission
router.post("/add-event", upload.single("image"), async (req, res) => {
    try {
        const { title, date, price, description } = req.body;
        const imageUrl = "/uploads/" + req.file.filename; // Save file path

        const newEvent = new Event({
            title,
            date,
            price,
            description,
            imageUrl
        });

        await newEvent.save();
        res.redirect("/admin"); // Redirect back to admin panel
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving event");
    }
});

export default router;
