const pageHomeAdmin = require("./Admin/home");
const homeAdmin = async (req, res) => {
  return pageHomeAdmin(req, res);
};

const pageStatsAdmin = require("./Admin/stats");
const statsAdmin = async (req, res) => pageStatsAdmin(req, res);

const pageClientsAdmin = require("./Admin/clients");
const clientsAdmin = async (req, res) => pageClientsAdmin(req, res);

const pagePaymentsAdmin = require("./Admin/payments");
const paymentsAdmin = async (req, res) => pagePaymentsAdmin(req, res);

const pageLoginAdmin = require("./Admin/login");
const loginAdmin = async (req, res) => pageLoginAdmin(req, res);

const authPinProses = require("./Admin/loginPin");
const authPinAdmin = async (req, res) => authPinProses(req, res);

module.exports = {
  homeAdmin,
  loginAdmin,
  authPinAdmin,
  statsAdmin,
  clientsAdmin,
  paymentsAdmin,
};
