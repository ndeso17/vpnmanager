const path = require("path");
const { addAlias } = require("module-alias");

// Fungsi untuk mendaftarkan semua alias
function interfaceAliases() {
  addAlias(
    "paymentsInterface",
    path.join(__dirname, "../Functions/Interface/payments")
  );
}

module.exports = interfaceAliases;
