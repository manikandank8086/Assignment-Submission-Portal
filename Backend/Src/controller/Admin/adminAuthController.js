import UserModel from "../../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Importing jwt to generate token

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existUser = await UserModel.findOne({ email: email });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists." });
    }

    // Generate a random user ID
    function generateRandomId() {
      const randomID = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Random ID: " + randomID);
      return randomID;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newRegister = await UserModel.create({
      userId: generateRandomId(),
      username: name,
      email: email,
      password: hashedPassword,
      role: "admin",
    });

    if (newRegister) {
      // Generate JWT token for the new user
      const token = jwt.sign(
        {
          id: newRegister._id,
          username: newRegister.username,
          role: newRegister.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Respond with success
      return res
        .status(200)
        .json({ success: true, token: token, message: "Registration Success" });
    } else {
      // If user creation failed
      return res
        .status(409)
        .json({ success: false, message: "User registration failed." });
    }
  } catch (error) {
    console.error("Server error during registration:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await UserModel.findOne({ email });

    if (!existUser) {
      return res
        .status(409)
        .json({ success: false, message: "Cannot find registered email." });
    }
    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password." });
    }

    // Check if the user has admin role
    if (existUser.role !== "admin") {
      console.warn(`User with email: ${email} is not an admin.`);
      return res
        .status(401)
        .json({ success: false, message: "Not valid admin data." });
    }

    // Generate a JWT token for successful login
    const token = jwt.sign(
      { id: existUser._id, username: existUser.username, role: existUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`Admin login successful for email: ${email}`);

    // Return the response with the token and success message
    return res.status(200).json({
      success: true,
      token,
      message: "Admin login success",
    });
  } catch (error) {
    console.error("Error occurred during login:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { register, login };
