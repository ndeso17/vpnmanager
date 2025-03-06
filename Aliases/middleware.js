const path = require("path");
const { addAlias } = require("module-alias");

// Fungsi untuk mendaftarkan semua alias
function middlewareAliases() {
  addAlias(
    "middlewareComparePin",
    path.join(__dirname, "../Middlewares/Auth/comparePin")
  );
  addAlias("level0", path.join(__dirname, "../Middlewares/Admin/level0"));
  addAlias(
    "refreshToken0",
    path.join(__dirname, "../Middlewares/Admin/refreshToken0")
  );
  addAlias(
    "cekSession",
    path.join(__dirname, "../Middlewares/Auth/cekSession")
  );
  addAlias("authPage", path.join(__dirname, "../Middlewares/Auth/authPage"));
}

module.exports = middlewareAliases;
