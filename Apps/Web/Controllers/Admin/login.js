const { loginApi } = require("../../../Api/apiAdmin");
const bodyChecker = require("bodyChecker");

const loginAdmin = async (req, res) => {
  try {
    const cekBody = bodyChecker(req, res);
    if (!cekBody) {
      console.log("Body Kosong");
      return res.status(200).renderAdmin("login", {
        message: "",
        step: "username",
      });
    }

    const login = await loginApi(req, res);
    const { statusCode, message } = login;
    if (statusCode !== 201) {
      return res.status(200).renderAdmin("login", {
        message: message,
        step: "username",
      });
    }

    return res
      .status(200)
      .renderAdmin("login", { message: message, step: "pin" });
  } catch (error) {
    console.error("Error rendering login page:", error.message);
    const datas = {
      title: "Login Page 500",
      description: "Login Page",
      keywords: "Login Page",
      data: error.message,
    };
    return res.status(404).render("Pages/404", { datas });
  }
};

module.exports = loginAdmin;
