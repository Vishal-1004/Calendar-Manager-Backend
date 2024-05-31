const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRECT_KEY = "abcdefghijklmnop";

// events schema (will be used in user schema)
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  events: {
    type: [eventSchema],
    default: [],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

// token generate at the time of login
userSchema.methods.generateAuthtoken = async function () {
  try {
    // Remove existing tokens
    this.tokens = [];

    let newtoken = jwt.sign({ _id: this._id }, SECRECT_KEY, {
      expiresIn: "1h", // 1h sets the expiration to 1 hour (30m for 30 minutes)
    });

    // Add the new token
    this.tokens = this.tokens.concat({ token: newtoken });

    await this.save();
    return newtoken;
  } catch (error) {
    res.status(400).json(error);
  }
};

// creating model
const User = mongoose.model("User", userSchema);

module.exports = User;
