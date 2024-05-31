const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.js");
const SECRECT_KEY = "abcdefghijklmnop";

const verifyTokenAndGetUser = async (token) => {
  try {
    const decoded = jwt.verify(token, SECRECT_KEY);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User Not Found");
    }

    return user;
  } catch (error) {
    throw new Error("Authentication Failed");
  }
};

module.exports = verifyTokenAndGetUser;
