const apiHome = require("./Admin/home");
const homeApi = async (req, res) => apiHome(req, res);

const trafikStats = require("./Admin/trafikStats");
const trafikStatsApi = async (req, res) => trafikStats(req, res);

const processes = require("./Admin/processes");
const processesApi = async (req, res) => processes(req, res);

const port = require("./Admin/port");
const portApi = async (req, res) => port(req, res);

const iptables = require("./Admin/iptables");
const iptablesApi = async (req, res) => iptables(req, res);

const clients = require("./Admin/clients");
const clientsApi = async (req, res) => clients(req, res);

const payments = require("./Admin/payments");
const paymentsApi = async (req, res) => payments(req, res);

//! Auth
const authLogin = require("./Auth/login");
const loginApi = async (req, res) => authLogin(req, res);

const comparePin = require("./Auth/comparePin");
const comparePinApi = async (req, res) => comparePin(req, res);

const refreshToken = require("./Auth/refreshToken");
const refreshTokenApi = async (req, res) => refreshToken(req, res);

module.exports = {
  homeApi,
  loginApi,
  comparePinApi,
  refreshTokenApi,
  trafikStatsApi,
  processesApi,
  portApi,
  iptablesApi,
  clientsApi,
  paymentsApi,
};
