const { decodeAksesToken } = require("../../Functions/Jwt/decodeJwt");

const cekSession = async (req, res, next) => {
  try {
    const dashToken = req.cookies.dashToken;
    const refreshDashToken = req.cookies.refreshDashToken;
    const session = req.session.logedSession;

    // Jika tidak ada session, redirect ke login
    if (!session) {
      console.log("Tidak ada session, redirect ke login");
      //   return res.redirect(302, "/auth/login");
      return next();
    }

    // Validasi dashToken
    if (dashToken) {
      const decodeDashToken = await decodeAksesToken(res, dashToken);

      // Jika decodeDashToken tidak valid (misalnya dari fungsi decodeAksesToken mengembalikan error page)
      if (
        !decodeDashToken ||
        (typeof decodeDashToken === "object" && decodeDashToken.status)
      ) {
        console.log("Dash Token tidak valid, butuh refresh token");
        if (!refreshDashToken) {
          console.log("Tidak ada refresh token, redirect ke login");
          //   return res.redirect(302, "/auth/login");
          return next();
        }
      } else {
        // Validasi data session dengan token
        const { username, role, sessionKey } = session;

        if (
          decodeDashToken.username !== username ||
          decodeDashToken.role !== role ||
          decodeDashToken.sessionKey !== sessionKey
        ) {
          console.log(
            "Data session tidak cocok dengan token, redirect ke login"
          );
          //   return res.redirect(302, "/auth/login");
          return next();
        }

        console.log("Decode Dash Token: ", decodeDashToken);
        return res.redirect(302, "/siempu");
      }
    }

    // Jika ada refreshDashToken tapi tidak ada dashToken
    if (refreshDashToken && !dashToken) {
      console.log("Refresh Dash Token tersedia: ", refreshDashToken);
      return res.redirect(302, "/siempu");
    }

    // Jika tidak ada token sama sekali
    if (!dashToken && !refreshDashToken) {
      console.log("Tidak ada token, redirect ke login");
      //   return res.redirect(302, "/auth/login");
      return next();
    }

    next();
  } catch (error) {
    console.error("Error Middleware cekSession =>", error);
    const datas = {
      title: "Not Found 500",
      description: "Internal Server Error!",
      keywords: "500",
      message: error.message,
    };
    return res.status(500).render("Pages/404", { datas });
  }
};

module.exports = cekSession;
