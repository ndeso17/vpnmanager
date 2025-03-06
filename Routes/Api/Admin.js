const express = require("express");
const router = express.Router();
const appAdmin = require("../../Apps/Api/apiAdmin");
const middlewareComparePin = require("middlewareComparePin");
const level0 = require("level0");
const refreshToken0 = require("refreshToken0");

router.get("/", level0, appAdmin.homeApi);
router.put("/stats", level0, appAdmin.trafikStatsApi);
router.put("/processes", level0, appAdmin.processesApi);
router.put("/ports", level0, appAdmin.portApi);
router.put("/iptables", level0, appAdmin.iptablesApi);
router.put("/clients", level0, appAdmin.clientsApi);
router.put("/payments", level0, appAdmin.paymentsApi);

//! Auth
router.post("/auth", appAdmin.loginApi);
router.delete("/auth", middlewareComparePin, appAdmin.comparePinApi);
router.put("/auth", refreshToken0, appAdmin.refreshTokenApi);

module.exports = router;
