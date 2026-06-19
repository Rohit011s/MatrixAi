import User from "../models/User.js";

export const signup= async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
    });

    const registeredUser = await User.register(newUser, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
export const signin= (req, res) => {
  console.log(req.user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      username: req.user.username,
      email: req.user.email,
    },
  });
}
export const me= (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({
      authenticated: false,
      user: null,
    });
  }

  res.json({
    authenticated: true,
    user: {
      username: req.user.username,
      email: req.user.email,
    },
  });
}
export const logout= (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Logout failed",
        });
      }

      res.clearCookie("connect.sid");

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
}