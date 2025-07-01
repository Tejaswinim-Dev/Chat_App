// Temporary in-memory store to track OTP verification status
const otpStatusStore = new Map(); // key = email, value = { verified: true }

module.exports = otpStatusStore;
