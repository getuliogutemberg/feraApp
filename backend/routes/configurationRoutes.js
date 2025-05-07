const express = require("express");
const { getConfiguration, updateConfiguration } = require("../controllers/configurationController");
const router = express.Router();

router.get("/", getConfiguration);
router.put("/", updateConfiguration);

module.exports = router;