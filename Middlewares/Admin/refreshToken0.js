const jwt = require("jsonwebtoken");
const response = require("response");
const formatedToken = require("formatedToken");
const {
  getExistUsername,
  getUserPin,
  authLogin,
} = require("../../Models/Admin/auth");

const refreshToken0 = async (req, res, next) => {
  try {
    const refreshDashTokenHeaders = req.headers.authorization;
    const refreshDashTokenHeader = await formatedToken(refreshDashTokenHeaders);
    const refreshDashToken =
      req.cookies.refreshDashToken || refreshDashTokenHeader;
    // console.log("Refresh Token Cookie : ", req.cookies.refreshDashToken);

    if (!refreshDashToken) {
      return response(res, {
        statusCode: 401,
        message: "Unauthorized, Middleware refreshToken. Token Null!",
        data: null,
      });
    }

    jwt.verify(
      refreshDashToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return response(res, {
            statusCode: 401,
            message: "Unauthorized, Middleware refreshToken. ",
            data: err,
          });
        }

        const { username } = decoded;
        const dataUser = await authLogin(username);
        const savedUsername = dataUser.savedUsername;
        const role = dataUser.role;
        if (username !== savedUsername) {
          console.log("Username tidak cocok");
          return response(res, {
            statusCode: 401,
            message: "Unauthorized, Middleware refreshToken. ",
            data: null,
          });
        }

        req.refreshData = { username, role };
        next();
      }
    );
  } catch (error) {
    console.error("Error Middleware refreshToken =>", error);
    return response(res, {
      statusCode: 500,
      message: "Internal Server Error, Middleware refreshToken",
      data: null,
    });
  }
};

module.exports = refreshToken0;
