const jwt = require("jsonwebtoken");

const decodeAksesToken = async (res, token) => {
  try {
    console.log("Decode Akses Token Dipanggil!");
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    return decoded;
  } catch (error) {
    console.error("Error Function decodeAksesToken =>", error);
    const datas = {
      title: "500",
      description: "Internal Server Error!",
      keywords: "500",
      message: error.message,
    };
    return res.status(500).render("Pages/404", { datas });
  }
};

const decodeRefreshToken = async (res, token) => {
  try {
    console.log("Decode Refresh Token Dipanggil!");
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    return decoded;
  } catch (error) {
    console.error("Error Function decodeAksesToken =>", error);
    const datas = {
      title: error.name === "JsonWebTokenError" ? "401" : "500",
      description:
        error.name === "JsonWebTokenError"
          ? "Unauthorized"
          : "Internal Server Error!",
      keywords: error.name === "JsonWebTokenError" ? "401" : "500",
      message: error.message,
    };
    return res
      .status(error.name === "JsonWebTokenError" ? 401 : 500)
      .render("Pages/404", { datas });
  }
};

module.exports = { decodeAksesToken, decodeRefreshToken };
