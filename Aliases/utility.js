const path = require("path");
const { addAlias } = require("module-alias");

// Fungsi untuk mendaftarkan semua alias
function utilityAliases() {
  addAlias("response", path.join(__dirname, "../Models/response"));
  addAlias("bodyChecker", path.join(__dirname, "../Models/bodyChecker"));
  addAlias("formatedToken", path.join(__dirname, "../Models/formatedToken"));
  addAlias("dbPool", path.join(__dirname, "../Configs/database"));
}

module.exports = utilityAliases;
