import { Router } from 'express';
import { getUploadUrl } from 'src/utils/aws';

const router = Router();

router.get('/', (req, res, _next) => {
  const { fileExtension } = req.query;

  // Check if fileExtension is undefined and handle the case appropriately
  if (typeof fileExtension !== 'string') {
    // Handle the case where fileExtension is undefined
    res
      .status(400)
      .json({ error: 'fileExtension is required in the query parameters' });
    return;
  }

  const secureUploadUrl = getUploadUrl(fileExtension);

  const jsonData = {
    secureUploadUrl,
    timestamp: new Date().toISOString(),
  };

  res.json(jsonData);
});

export default router;
