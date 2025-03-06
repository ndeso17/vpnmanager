const response = require("response");
const bodyChecker = require("bodyChecker");
const { v4: uuidv4 } = require("uuid");
const { authLogin } = require("../../../Models/Admin/auth");
const {
  tokenDashboard,
  refrehTokenDashboard,
} = require("../../../Functions/Jwt/createJwt");

const comparePin = async (req, res) => {
  try {
    if (!bodyChecker(req, res)) return;
    // const sessionAuthPin = req.session.authSession;
    // console.log("Body ada : ", req.body, "Session Auth Pin : ", sessionAuthPin);

    const username = req.session.authSession.username;
    const savedAuthPin = req.session.authSession.authPin;
    const { authPin = null } = req.body || {};
    if (!authPin || authPin !== savedAuthPin) {
      return response(res, {
        statusCode: 401,
        message: "Auth Pin salah!",
        data: null,
      });
    }
    const key = uuidv4();
    const sessionKey = `${key}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}`;

    const { role } = await authLogin(username);
    const dashToken = await tokenDashboard(username, role, sessionKey);
    const refreshDashToken = await refrehTokenDashboard(username, sessionKey);

    delete req.session.authSession;
    res.cookie("dashToken", dashToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 2,
    });
    res.cookie("refreshDashToken", refreshDashToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 10,
    });
    req.session.logedSession = { username, role, sessionKey };
    res.clearCookie("authToken", { path: "/" });

    return {
      statusCode: 201,
      message: "PIN Auth True!",
      data: {
        dashToken: dashToken,
        refreshDashToken: refreshDashToken,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
    };
    // response(res, {
    //   statusCode: 500,
    //   message: "Internal Server Error",
    //   data: null,
    // });
  }
};

module.exports = comparePin;
