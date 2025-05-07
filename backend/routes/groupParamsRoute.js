const express = require("express");
const { getGroupParams, createGroupParams, updateGroupParams, deleteGroupParams } = require("../controllers/groupParamsController.js");
const router = express.Router();

router.get("/:cod_grupo", getGroupParams);
router.post("/", createGroupParams);
router.put("/:cod_grupo", updateGroupParams);
router.delete("/:cod_grupo", deleteGroupParams);

module.exports = router;