const path = require("path");
const { addAlias } = require("module-alias");

// Fungsi untuk mendaftarkan semua alias
function modelsAliases() {
  addAlias(
    "getAllClients",
    path.join(__dirname, "../Models/Admin/getAllClients.js")
  );
  addAlias(
    "getAllPayments",
    path.join(__dirname, "../Models/Admin/getAllPayments.js")
  );
}

module.exports = modelsAliases;
