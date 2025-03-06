const getAllPayments = require("getAllPayments");
const paymentsInterface = require("paymentsInterface");
const paymentsAdmin = async (req, res) => {
  try {
    const rawPayments = await getAllPayments();
    const payments = await paymentsInterface(rawPayments);

    if (!req.session || !req.session.dataAdmin) {
      throw new Error("Session tidak valid atau data admin tidak ditemukan");
    }
    const username = req.session.logedSession.username;
    const { title, description, keywords, message } = req.session.dataAdmin;
    const datas = {
      title: title,
      description: description,
      keywords: keywords,
      message: message,
    };
    res.status(200).renderAdmin("payments", {
      datas,
      adminName: username,
      payments: payments,
    });
  } catch (error) {
    res.clearCookie("dashToken", { path: "/" });
    res.clearCookie("refreshDashToken", { path: "/" });
    const datas = {
      title: "Dashboard",
      description: "Login False!",
      keywords: "403",
    };
    return res.status(403).render("Pages/404", { datas });
  }
};

module.exports = paymentsAdmin;
