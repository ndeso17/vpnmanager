const sanitizeHtml = require("sanitize-html"); // Impor library
const getCpuLoad = require("getCpuLoad");
const getDiskUsage = require("getDiskUsage");
const getIptables = require("getIptables");
const getNetworkPorts = require("getNetworkPorts");
const getProcesses = require("getProcesses");
const getRamUsage = require("getRamUsage");
const getBandwidth = require("getBandwidth");

const statsAdmin = async (req, res) => {
  try {
    if (!req.session || !req.session.dataAdmin) {
      throw new Error("Session tidak valid atau data admin tidak ditemukan");
    }

    // Sanitasi username untuk keamanan
    const username = sanitizeHtml(req.session.logedSession.username, {
      allowedTags: [], // Tidak izinkan tag HTML apa pun
      allowedAttributes: {}, // Tidak izinkan atribut HTML
    });

    const cpuLoad = await getCpuLoad();
    const diskUsage = await getDiskUsage();
    const iptables = await getIptables();
    const networkPort = await getNetworkPorts();
    const processes = await getProcesses();
    const ramUsage = await getRamUsage();
    const bandwidth = await getBandwidth();

    const { title, description, keywords, message } = req.session.dataAdmin;
    const datas = {
      title: title,
      description: description,
      keywords: keywords,
      message: message,
      stats: {
        cpuLoad,
        diskUsage,
        iptables,
        networkPort,
        processes,
        ramUsage,
        bandwidth,
      },
    };
    res.status(200).renderAdmin("stats", { datas, adminName: username });
  } catch (error) {
    res.clearCookie("dashToken", { path: "/" });
    res.clearCookie("refreshDashToken", { path: "/" });
    const datas = {
      title: "Dashboard",
      description: "Login False!",
      keywords: "403",
    };
    console.error("Datas Error Stats Controller : ", error.message);
    res.status(403).render("Pages/404", { datas });
  }
};

module.exports = statsAdmin;
