const express = require("express");

const controllers = require("../controllers/userControllers.js");

const router = new express.Router();

// Server Home Page Message
router.get("/", controllers.api);

// User Login route
router.post("/login", controllers.userLogin);

// User Register route
router.post("/register", controllers.userRegister);

// Add Event
router.post("/addEvent", controllers.addEvent);

// Get all events in a given month and year for a User
router.post("/allEvents", controllers.getEvents);

// Update an event
router.put("/updateEvent", controllers.updateEvent);

// Delete and event
router.delete("/deleteEvent", controllers.deleteEvent);

module.exports = router;
