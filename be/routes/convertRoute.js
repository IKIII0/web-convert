import { Router } from 'express';
import multer from 'multer';
import {
  convertImage,
  convertUnitHandler,
  getUnitInfo,
  convertColorHandler,
  imagesToPdf,
  mergePdfs,
  pdfToImages,
  officeToPdf,
  convertAudio,
  convertVideo,
  convertVideoToAudio,
} from '../controllers/convertController.js';

const router = Router();

// Multer config — store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for video
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
router.post('/pdf/to-images', upload.array('files', 20), pdfToImages);
router.post('/pdf/from-office', upload.single('file'), officeToPdf);

// Audio conversion
router.post('/audio', upload.single('file'), convertAudio);

// Video conversion
router.post('/video', upload.single('file'), convertVideo);

// Video to Audio extraction
router.post('/video-to-audio', upload.single('file'), convertVideoToAudio);

export default router;
