import express from 'express';
import { success, error } from '.././red/response.js';

const router = express.Router();

router.get('/', (req, res) => {
    success(req, res, 'Todo ok', 200);
});

export default router;
