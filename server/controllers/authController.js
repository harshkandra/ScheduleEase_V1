import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, userType } = req.body;

    if (!email || !userType)
      return res.status(400).json({ message: "Email and userType are required" });

    let user = await User.findOne({ email });

    // Auto-register new users
    if (!user) {
      user = new User({ email, userType });
      await user.save();
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
