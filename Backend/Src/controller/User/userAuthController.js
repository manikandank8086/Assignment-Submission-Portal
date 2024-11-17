import UserModel from "../../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Importing jwt to generate token

const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if the user already exists
    const existUser = await UserModel.findOne({ email: email });
    if (existUser) {
      // Return a 400 status with a clear error message if the user already exists
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }
    function genarateRandomId() {
      const randomID = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("radom id " + randomID);
      return randomID;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRegister = await UserModel.create({
      userId: genarateRandomId(),
      username: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      role: "user",
    });

    console.log("process.");
    console.log(process.env.JWT_SECRET);

    if (newRegister) {
      console.log("enter");
      // Generate JWT token
      const token = jwt.sign(
        {
          id: newRegister._id,
          username: newRegister.username,
          role: newRegister.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log("tokent is" + token);

      return res
        .status(200)
        .json({ success: true, token: token, message: "Registration Success" });
    } else {
      // Return a 409 status if registration fails unexpectedly
      return res
        .status(409)
        .json({ success: false, message: "User registration failed." });
    }
  } catch (error) {
    console.error("Server error during registration: " + error);
    // Return a 500 status for server-related errors
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const googleRegister = async (req, res) => {
  try {
    console.log("Working google registration");
    console.log(req.body);
    const { email, name } = req.body;

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    function genarateRandomId() {
      const randomID = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("radom id " + randomID);
      return randomID;
    }

    const newUser = await UserModel.create({
      userId: genarateRandomId(),
      email: email,
      username: name,
      role: "user",
    });

    if (newUser) {
      console.log("User successfully registered");

      const token = jwt.sign(
        {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log("Token is: " + token);

      return res
        .status(200)
        .json({
          success: true,
          token: token,
          message: "Google registration successful",
        });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "User registration failed" });
    }
  } catch (error) {
    console.log("Catch error: " + error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    console.log("working login controller");
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email)
    const existUser = await UserModel.findOne({ email: email });
    console.log(existUser)
    if (existUser) {
        console.log('eeeeeee')
      const isMatch = await bcrypt.compare(password, existUser.password);
      if (isMatch) {
        console.log("find it");
        const token = jwt.sign(
          {
            id: existUser._id,
            username: existUser.username,
            role: existUser.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        console.log("tokent is" + token);
        return res
          .status(200)
          .json({ success: true, token: token, message: "User login success" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Incorrent Password" });
      }
    }
    console.log("not find it ");
    return res
      .status(409)
      .json({ success: false, message: "Cannot fined registerd email" });
  } catch (error) {
    console.log("catching error: " + error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const googleLogin = async (req, res) => {
  try {
    console.log("working login controller");
    console.log(req.body);
    const { email } = req.body;
    const existUser = await UserModel.findOne({ email: email });
    if (existUser) {
      console.log("find it");
      const token = jwt.sign(
        {
          id: existUser._id,
          username: existUser.username,
          role: existUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log("tokent is" + token);
      return res
        .status(200)
        .json({ success: true, token: token, message: "User login success" });
    }
    console.log("not find it ");
    return res
      .status(409)
      .json({ success: false, message: "User login failed" });
  } catch (error) {
    console.log("catching error: " + error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { register, googleLogin, googleRegister, login };
