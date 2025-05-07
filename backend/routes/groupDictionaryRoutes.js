const express = require("express");
const { getGroupDictionary  } = require("../controllers/groupDictionaryController.js");
const router = express.Router();

router.get("/", getGroupDictionary);

module.exports = router;