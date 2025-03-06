const express = require("express");
const router = express.Router();
const appAdmin = require("../../Apps/Web/Controllers/appAdmin");
const level0 = require("level0");

router.get("/", level0, appAdmin.homeAdmin);
router.get("/stats", level0, appAdmin.statsAdmin);
router.get("/clients", level0, appAdmin.clientsAdmin);
router.get("/payments", level0, appAdmin.paymentsAdmin);

module.exports = router;
