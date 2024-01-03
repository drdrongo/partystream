import { Router } from 'express';

const router = Router();

router.get('/', (req, res, _next) => {
  res.json({});
});

export default router;
