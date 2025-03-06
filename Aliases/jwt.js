const path = require("path");
const { addAlias } = require("module-alias");

// Fungsi untuk mendaftarkan semua alias
function jwtAliases() {
  addAlias("decodeJwt", path.join(__dirname, "Functions/Jwt/decodeJwt"));
}

module.exports = jwtAliases;
