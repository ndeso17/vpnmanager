const response = require("response");
const formatedToken = require("formatedToken");
const jwt = require("jsonwebtoken");
const level0 = async (req, res, next) => {
  try {
    const dashTokenHeaders = req.headers.authorization;
    const dashTokenHeader = await formatedToken(dashTokenHeaders);
    const dashToken = req.cookies.dashToken || dashTokenHeader;

    if (!dashToken) {
      return response(res, {
        statusCode: 401,
        message: "Unauthorized, Middleware level0. Token Null!",
        data: null,
      });
    }

    jwt.verify(dashToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return response(res, {
          statusCode: 401,
          message: "Unauthorized, Middleware level0. ",
          data: err,
        });
      }

      console.log("Decode Token Middleware Level0 =>", decoded);
      //         username: 'adminvpnmanager',
      //   role: 'siempoe',
      //   sessionKey: '3502d569-9df3-47c5-9202-93e17a9bc74f-1740943184788-3rrbidg0ak9',
      //   const { username, role, uniqueKey } = req.session.logedSession;
      console.log("Logged Session : ", req.session.logedSession);
      next();
    });
  } catch (error) {
    console.error("Error Middleware Level0 =>", error);
    return response(res, {
      statusCode: 500,
      message: "Internal Server Error, Middleware Level0",
      data: null,
    });
  }
};

module.exports = level0;
