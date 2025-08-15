"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const equipamentoManutController_1 = require("../controllers/equipamentoManutController");
const router = (0, express_1.Router)();
router.get('/obsolescencia', equipamentoManutController_1.getObsolescencia);
router.put('/obsolescencia', equipamentoManutController_1.updateObsolescencia);
router.get('/custohxh', equipamentoManutController_1.getCustoHxH);
router.post('/custohxh', equipamentoManutController_1.createCustoHxH);
router.put('/custohxh', equipamentoManutController_1.updateCustoHxH);
router.delete('/custohxh', equipamentoManutController_1.deleteCustoHxH);
router.get('/pesosahp', equipamentoManutController_1.getPesosAHP);
router.put('/pesosahp', equipamentoManutController_1.updatePesosAHP);
exports.default = router;
//# sourceMappingURL=equipamentoManut.js.map