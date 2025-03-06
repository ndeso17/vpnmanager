const getAllClients = require("getAllClients");
const clientsAdmin = async (req, res) => {
  try {
    const clients = await getAllClients();

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
    res
      .status(200)
      .renderAdmin("clients", { datas, adminName: username, clients: clients });
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

module.exports = clientsAdmin;
