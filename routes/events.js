import express from "express";
import Event from "../models/Event.js";

const router = express.Router();
const EVENTS_PER_PAGE = 7;

// Home route with pagination
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const totalEvents = await Event.countDocuments();
        const totalPages = Math.ceil(totalEvents / EVENTS_PER_PAGE);

        const events = await Event.find()
            .skip((page - 1) * EVENTS_PER_PAGE)
            .limit(EVENTS_PER_PAGE);

        res.render("index", { events, page, totalPages });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Server error");
    }
});

// Search events
router.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.redirect("/");

        const events = await Event.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } }
            ]
        });

        res.render("index", { events, page: 1, totalPages: 1 });
    } catch (error) {
        console.error("Error searching events:", error);
        res.status(500).send("Server error");
    }
});


export default router;
