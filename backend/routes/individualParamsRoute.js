const express = require("express");
const { getIndividualParams, createIndividualParams, updateIndividualParams, deleteIndividualParams } = require("../controllers/individualParamsController.js");
const router = express.Router();

router.get("/:cod_grupo", getIndividualParams);
router.post("/", createIndividualParams);
router.put("/:cod_grupo", updateIndividualParams);
router.delete("/:cod_grupo", deleteIndividualParams);

module.exports = router;