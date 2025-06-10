import { Router } from 'express';
import { getObsolescencia, getCustoHxH, getPesosAHP, createCustoHxH, updateCustoHxH, deleteCustoHxH, updatePesosAHP, updateObsolescencia } from '../controllers/equipamentoManutController';

const router = Router();

router.get('/obsolescencia', getObsolescencia);
router.put('/obsolescencia', updateObsolescencia);
router.get('/custohxh', getCustoHxH);
router.post('/custohxh', createCustoHxH);
router.put('/custohxh', updateCustoHxH);
router.delete('/custohxh', deleteCustoHxH);
router.get('/pesosahp', getPesosAHP);
router.put('/pesosahp', updatePesosAHP);

export default router; 