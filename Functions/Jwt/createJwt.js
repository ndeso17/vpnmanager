const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;
const authTokenSecret = process.env.AUTH_TOKEN_SECRET;
const secretRefresh = process.env.REFRESH_TOKEN_SECRET;

const tokenAuthPin = async (username, authPin) => {
  try {
    const payload = { username, authPin };
    const token = jwt.sign(payload, authTokenSecret, {
      algorithm: "HS512",
      expiresIn: "2m",
    });
    if (token) return token;
  } catch (error) {
    console.error("Terjadi kesalahan saat membuat Akses Token:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat Akses Token.",
      data: error,
    };
  }
};

const tokenDashboard = async (username, role, sessionKey) => {
  try {
    const payload = { username, role, sessionKey };
    const token = jwt.sign(payload, secret, {
      algorithm: "HS512",
      expiresIn: "10m",
    });
    if (token) return token;
  } catch (error) {
    console.error(
      "Terjadi kesalahan saat membuat Dashboard Akses Token:",
      error
    );
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat Dashboard Akses Token.",
      data: error,
    };
  }
};

const refrehTokenDashboard = async (username, sessionKey) => {
  try {
    const payload = { username, sessionKey };
    const token = jwt.sign(payload, secretRefresh, {
      algorithm: "HS512",
      expiresIn: "30m",
    });
    if (token) return token;
  } catch (error) {
    console.error("Terjadi kesalahan saat membuat Refresh Token:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat membuat Refresh Token.",
      data: error,
    };
  }
};

module.exports = { tokenAuthPin, tokenDashboard, refrehTokenDashboard };
