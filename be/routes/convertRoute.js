import { Router } from 'express';
import multer from 'multer';
import {
  convertImage,
  convertUnitHandler,
  getUnitInfo,
  convertColorHandler,
  imagesToPdf,
  mergePdfs,
} from '../controllers/convertController.js';

const router = Router();

// Multer config — store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Image conversion
router.post('/image', upload.single('file'), convertImage);

// Unit conversion
router.post('/unit', convertUnitHandler);
router.get('/unit/info', getUnitInfo);

// Color conversion
router.post('/color', convertColorHandler);

// PDF operations
router.post('/pdf/from-images', upload.array('files', 20), imagesToPdf);
router.post('/pdf/merge', upload.array('files', 20), mergePdfs);

export default router;
