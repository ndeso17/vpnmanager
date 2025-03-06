const response = require("response");
const {
  tokenDashboard,
  refrehTokenDashboard,
} = require("../../../Functions/Jwt/createJwt");
const { v4: uuidv4 } = require("uuid");

const refreshToken = async (req, res) => {
  try {
    // console.log("Refresh Data A : ", req.refreshData);
    const { username, role } = req.refreshData;
    const key = uuidv4();
    const sessionKey = `${key}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}`;
    const generateAksesToken = await tokenDashboard(username, role, sessionKey);
    const generateRefreshToken = await refrehTokenDashboard(
      username,
      sessionKey
    );

    res.cookie("dashToken", generateAksesToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 2,
    });
    res.cookie("refreshDashToken", generateRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 10,
    });
    req.session.logedSession = { username, role, sessionKey };
    delete req.refreshData.username;
    delete req.refreshData.role;

    // console.log("Refresh Data B : ", req.refreshData);
    response(res, {
      statusCode: 201,
      message: "Refresh Token Ok",
      data: {
        dashToken: generateAksesToken,
        refreshToken: generateRefreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    response(res, {
      statusCode: 500,
      message: "Internal Server Error, refreshToken",
      data: null,
    });
  }
};

module.exports = refreshToken;
