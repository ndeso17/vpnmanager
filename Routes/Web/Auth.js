const express = require("express");
const router = express.Router();
const appAdmin = require("../../Apps/Web/Controllers/appAdmin");
const authPage = require("authPage");

router.get("/login", authPage, appAdmin.loginAdmin);
router.post("/login", authPage, appAdmin.loginAdmin);
router.post("/loginpin", authPage, appAdmin.authPinAdmin);

module.exports = router;
