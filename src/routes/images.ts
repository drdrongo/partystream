import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { getObjectList, getUploadUrl } from 'src/utils/aws';

const router = Router();

router.get(
  '/list',
  expressAsyncHandler(async (req, res, _next) => {
    const imageKeys = await getObjectList();
    res.json(imageKeys);
  }),
);

router.get(
  '/upload-url',
  expressAsyncHandler(async (req, res, _next) => {
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
  }),
);

export default router;
