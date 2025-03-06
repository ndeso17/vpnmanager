const formatedToken = require("formatedToken");
const jwt = require("jsonwebtoken");
const { authLogin } = require("../../Models/Admin/auth");
const axios = require("axios");

const getRefreshToken = async (res, savedRefreshDashToken) => {
  try {
    const options = {
      method: "PUT",
      url: "http:192.168.17.248:4000/api/empu/auth",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${savedRefreshDashToken}`,
      },
      withCredentials: true,
    };
    const requestDashToken = await axios.request(options);
    const data = requestDashToken.data;
    const statusCode = data.statusCode;

    const newToken = data.data;
    if (statusCode === 201) {
      res.cookie("dashToken", newToken.dashToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
      });
      res.cookie("refreshDashToken", newToken.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
      });

      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching refresh token:", error.message);
    return false;
  }
};
const level0 = async (req, res, next) => {
  try {
    const dashTokenHeaders = req.headers.authorization;
    const dashTokenHeader = await formatedToken(dashTokenHeaders);
    const dashToken = req.cookies.dashToken || dashTokenHeader;
    const savedRefreshDashToken = req.cookies.refreshDashToken;
    const requestedPath = req.log.path;

    if (!dashToken) {
      if (
        requestedPath.startsWith("/siempu") ||
        requestedPath.startsWith("/auth")
      ) {
        const refresh = await getRefreshToken(res, savedRefreshDashToken);
        if (!refresh) {
          console.log("Galat Refresh Token! /siempu /auth");
          return res.redirect(302, "/auth/login");
        }
        return next();
      }

      return res.redirect(302, "/");
    }

    jwt.verify(
      dashToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          const refresh = await getRefreshToken(res, savedRefreshDashToken);
          if (!refresh) {
            console.log("Galat Refresh Token!");
            return res.redirect(302, "/auth/login");
          }
          return next();
        }

        const { username, role } = decoded;
        const dataUser = await authLogin(username);
        const savedRole = dataUser.role;

        if (role !== savedRole) {
          console.log("Session Invalid!");
          return res.redirect(302, "/auth/login");
        }
        next();
      }
    );
  } catch (error) {
    console.error("Error Middleware Level0 =>", error);
    const datas = {
      title: "Not Found 500",
      description: "Internal Server Error!",
      keywords: "500",
      message: error.message,
    };
    return res.status(500).render("Pages/404", { datas });
  }
};

module.exports = level0;
