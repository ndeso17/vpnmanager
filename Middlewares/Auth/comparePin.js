const jwt = require("jsonwebtoken");
const response = require("response");
const formatedToken = require("formatedToken");

const comparePin = async (req, res, next) => {
  try {
    const authTokenHeader = req.headers.authorization;
    const authToken = await formatedToken(authTokenHeader);
    const token = req.cookies.authToken || authToken;

    if (!token) {
      return response(res, {
        statusCode: 401,
        message: "Unauthorized, Middleware comparePin. Token Null!",
        data: null,
      });
    }

    jwt.verify(token, process.env.AUTH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return response(res, {
          statusCode: 401,
          message: "Unauthorized, Middleware comparePin. ",
          data: err,
        });
      }

      req.session.authSession = {
        username: decoded.username,
        authPin: decoded.authPin,
      };
      next();
    });
  } catch (error) {
    console.error("Error Middleware comparePin =>", error);
    return response(res, {
      statusCode: 500,
      message: "Internal Server Error, Middleware comparePin",
      data: null,
    });
  }
};

module.exports = comparePin;
