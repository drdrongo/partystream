import { Router } from 'express';

const router = Router();

router.get('/', function(req, res, next) {
  const jsonData = {
    message: 'Hello, World!',
    timestamp: new Date().toISOString(),
  };
  res.json(jsonData);
});

export default router;
