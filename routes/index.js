const express = require('express');
const router = express.Router();

const Table_1 = require('../controllers/table_1');

router.get('/table_1', Table_1.get);
router.post('/table_1', Table_1.add);
router.put('/table_1', Table_1.update);
router.delete('/table_1', Table_1.remove);


module.exports = router;