import { Router } from 'express';
import { getUploadUrl } from 'src/utils/aws';

const router = Router();

router.get('/', (req, res, next) => {
  const secureUploadUrl = getUploadUrl();

  // TODO: Use the secure URL to upload the image.

  const jsonData = {
    secureUploadUrl,
    timestamp: new Date().toISOString(),
  };

  res.json(jsonData);
});

export default router;
