import User from "../models/User.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    console.log("🔍 Search query received:", search);
    console.log("👤 Current user ID:", req.user._id);

    let query = { _id: { $ne: req.user._id } };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { username: { $regex: searchRegex } },
        { email: { $regex: searchRegex } }
      ];
      console.log("🔍 Applying search filter:", query);
    }

    const users = await User.find(query, "-password").sort({ username: 1 });

    console.log("📊 Users found:", users.length);
    console.log("👥 User list:", users.map(u => ({ id: u._id, username: u.username, email: u.email })));

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (err) {
    console.error("❌ Error in getAllUsers:", err.message);
    next(err);
  }
};