const path = require("path");
const { addAlias } = require("module-alias");

// Fungsi untuk mendaftarkan semua alias
function utilityServerAliases() {
  addAlias(
    "getNetworkTraffic",
    path.join(__dirname, "../Functions/Server/getNetTrafik")
  );
  addAlias(
    "getCpuLoad",
    path.join(__dirname, "../Functions/Server/getCpuLoad")
  );
  addAlias(
    "getDiskUsage",
    path.join(__dirname, "../Functions/Server/getDisks")
  );
  addAlias(
    "getIptables",
    path.join(__dirname, "../Functions/Server/getIptables")
  );
  addAlias(
    "getNetworkPorts",
    path.join(__dirname, "../Functions/Server/getNetworkPorts")
  );
  addAlias(
    "getProcesses",
    path.join(__dirname, "../Functions/Server/getProcesses")
  );
  addAlias(
    "getRamUsage",
    path.join(__dirname, "../Functions/Server/getRamUsage")
  );
  addAlias(
    "getBandwidth",
    path.join(__dirname, "../Functions/Server/getBandwidth")
  );
  addAlias("cekKuota", path.join(__dirname, "../Functions/Server/cekKuota"));
}

module.exports = utilityServerAliases;
