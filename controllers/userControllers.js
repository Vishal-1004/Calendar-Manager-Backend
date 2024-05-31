const bcrypt = require("bcryptjs");

// Importing Utility function
const verifyTokenAndGetUser = require("../Utility/authUtils.js");

// Importing models
const User = require("../models/userSchema.js");

// Server Home Page Message
exports.api = async (req, res) => {
  res.status(200).json({ message: "Server is working" });
};

// User registration
exports.userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please Enter All Required Input Data" });
  }

  try {
    const preUser = await User.findOne({ email: email });

    if (preUser) {
      return res.status(400).json({ message: "This User Already Exists" });
    } else {
      const userRegister = new User({
        name,
        email,
        password,
      });

      // Password hashing is done in the User model schema
      await userRegister.save();

      return res.status(200).json({ message: "Registered Successfully!" });
    }
  } catch (error) {
    console.error("Registration Error: ", error);
    return res
      .status(400)
      .json({ error: "Invalid Details", message: error.message });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Email or password not provided");
    return res
      .status(400)
      .json({ message: "Please Enter All Required Input Data" });
  }

  try {
    const findUser = await User.findOne({ email: email });

    if (findUser) {
      const passwordCheck = await bcrypt.compare(password, findUser.password);

      if (passwordCheck) {
        const token = await findUser.generateAuthtoken();

        return res.status(200).json({
          message: "Login Successfully!",
          userToken: token,
        });
      } else {
        //console.log("Invalid passowrd");
        return res.status(400).json({ message: "Wrong Password" });
      }
    } else {
      //console.log("Please Register First");
      return res.status(400).json({ message: "Please Register First" });
    }
  } catch (error) {
    //console.error("Error during login:", error);
    return res
      .status(400)
      .json({ error: "Invalid Details", message: error.message });
  }
};

// Add Event to User
exports.addEvent = async (req, res) => {
  const { token, title, description, startTime, endTime, date, month, year } =
    req.body;

  if (
    !token ||
    !title ||
    !description ||
    !startTime ||
    !endTime ||
    !date ||
    !month ||
    !year
  ) {
    return res
      .status(400)
      .json({ error: "Please Enter All Required Input Data" });
  }

  try {
    const user = await verifyTokenAndGetUser(token);

    const newEvent = {
      title,
      description,
      startTime,
      endTime,
      date,
      month,
      year,
    };

    // User --> user (only in this function)
    user.events.push(newEvent);

    // User --> user (only in this function)
    await user.save();

    return res.status(200).json({ message: "Event Added Successfully!" });
  } catch (error) {
    console.error("Add Event Error: ", error);
    return res
      .status(400)
      .json({ error: "Failed to Add Event", details: error.message });
  }
};

// Get all events in a given month and year for a user
exports.getEvents = async (req, res) => {
  const { token, month, year } = req.body;

  if (!token || !month || !year) {
    return res.status(400).json({ error: "Please provide month and year" });
  }

  try {
    const user = await verifyTokenAndGetUser(token);

    const events = user.events.filter(
      (event) => event.month === month && event.year === year
    );

    return res.status(200).json({ events });
  } catch (error) {
    console.error("Get Events Error: ", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve events", details: error.message });
  }
};

// Update an event by its ID for a user
exports.updateEvent = async (req, res) => {
  const { token, eventId, newTitle, newDescription, newStartTime, newEndTime } =
    req.body;

  if (
    !token ||
    !eventId ||
    !newTitle ||
    !newDescription ||
    !newStartTime ||
    !newEndTime
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const user = await verifyTokenAndGetUser(token);

    const event = user.events.id(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event Not Found" });
    }

    event.title = newTitle;
    event.description = newDescription;
    event.startTime = newStartTime;
    event.endTime = newEndTime;

    await user.save();

    return res
      .status(200)
      .json({ message: "Event Updated Successfully!", event });
  } catch (error) {
    console.error("Update Event Error: ", error);
    return res
      .status(500)
      .json({ error: "Failed to update event", details: error.message });
  }
};

// Delete an event by its ID for a user
exports.deleteEvent = async (req, res) => {
  const { token, eventId } = req.body;

  if (!token || !eventId) {
    return res.status(400).json({ error: "Please provide token & eventId" });
  }

  try {
    const user = await verifyTokenAndGetUser(token);

    const eventIndex = user.events.findIndex(
      (event) => event._id.toString() === eventId
    );

    if (eventIndex === -1) {
      return res.status(404).json({ message: "Event Not Found" });
    }

    user.events.splice(eventIndex, 1);
    await user.save();

    return res.status(200).json({ message: "Event Deleted Successfully" });
  } catch (error) {
    console.error("Delete Event Error: ", error);
    return res
      .status(500)
      .json({ error: "Failed to delete event", details: error.message });
  }
};
