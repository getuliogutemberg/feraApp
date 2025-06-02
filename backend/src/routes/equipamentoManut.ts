import { Router } from 'express';
import { getObsolescencia, getCustoHxH, getPesosAHP } from '../controllers/equipamentoManutController';

const router = Router();

router.get('/obsolescencia', getObsolescencia);
router.get('/custohxh', getCustoHxH);
router.get('/pesosahp', getPesosAHP);

export default router; 