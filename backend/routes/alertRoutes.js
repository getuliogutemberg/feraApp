const express = require("express");
const { getAlerts, createAlert, updateAlert, deleteAlert } = require("../controllers/alertController.js");
const router = express.Router();

router.get("/", getAlerts);
router.post("/", createAlert);
router.put("/:id", updateAlert);
router.delete("/:id", deleteAlert);

module.exports = router;
