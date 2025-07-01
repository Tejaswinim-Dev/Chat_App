const asyncHandler = require('express-async-handler');
const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const otpStatusStore = require('../otpStatusStore');

const userCtrl = {
  register: asyncHandler(async (req, res, next) => {
    try {
      const { username, email, password, confirmpassword } = req.body;

      // ✅ Ensure OTP was verified
      // const otpStatus = otpStatusStore.get(email);
      // if (!otpStatus || !otpStatus.verified) {
      //   return res.status(403).json({ status: false, message: "OTP not verified for this email." });
      // }

      // ✅ Validate inputs
      if (password !== confirmpassword) {
        return res.status(400).json({ message: 'Passwords do not match', status: false });
      }

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(409).json({ status: false, message: "Username or email already exists" });
      }

      // ✅ Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, email, password: hashedPassword });

      // ✅ Clean up after successful registration
      otpStatusStore.delete(email);

      return res.status(201).json({ status: true, user: newUser });

    } catch (error) {
      next(error);
    }
  }),

  login: asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: false, message: "Invalid password" });
    }

    res.status(200).json({ status: true, user });
  }),

  setAvatar: async (req, res) => {
    try {
      const userId = req.params.id;
      const { image } = req.body;

      if (!userId || !image) {
        return res.status(400).json({ status: false, message: "Missing data" });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImg: image,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }

      return res.status(200).json({
        status: true,
        isSet: user.isAvatarImageSet,
        image: user.avatarImg,
      });

    } catch (error) {
      console.error("Set Avatar Error:", error.message);
      return res.status(500).json({ status: false, message: "Internal error" });
    }
  },

  getAllUsers: asyncHandler(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.query.currentUserId } }).select([
      "email",
      "username",
      "avatarImg",
      "_id",
    ]);
    return res.status(200).json(users);
  }),
};

module.exports = userCtrl;
