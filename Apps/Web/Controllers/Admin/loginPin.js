const { comparePinApi } = require("../../../Api/apiAdmin");
const bodyChecker = require("bodyChecker");

const loginAdmin = async (req, res) => {
  try {
    const cekBody = bodyChecker(req, res);
    if (!cekBody) {
      // console.log("Body Kosong");
      return res.status(200).renderAdmin("login", {
        message: "",
        step: "username",
      });
    }

    const pinAuth = await comparePinApi(req, res);
    // console.log("Pin Auth : ", pinAuth);
    const { statusCode, message } = pinAuth;
    if (statusCode !== 201) {
      return res.status(200).renderAdmin("login", {
        message: message,
        step: "username",
      });
    }

    const datas = {
      title: "Dashboard",
      description: "Login True!",
      keywords: "Dashboard",
      message: message,
      error: "",
    };
    // return res.status(200).renderAdmin("home", { datas });
    req.session.dataAdmin = datas;
    return res.redirect("/siempu/");
  } catch (error) {
    const datas = {
      title: "404",
      description: "Apakah anda tersesat?",
      keywords: "404",
      error: error.message,
    };
    return res.status(404).render("Pages/404", { datas });
  }
};

module.exports = loginAdmin;
