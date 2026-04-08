import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { pdfToPng } from 'pdf-to-png-converter';
import JSZip from 'jszip';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import os from 'os';
import axios from 'axios';
import FormData from 'form-data';
import ffmpeg from 'fluent-ffmpeg';
import { convertUnit, getCategories, getUnits } from '../utils/unitConverter.js';
import { convertColor } from '../utils/colorConverter.js';

export async function convertImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { format } = req.body;
    const allowedFormats = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'avif'];

    if (!format || !allowedFormats.includes(format.toLowerCase())) {
      return res.status(400).json({
        error: `Invalid format. Allowed: ${allowedFormats.join(', ')}`,
      });
    }

    const outputFormat = format.toLowerCase() === 'jpg' ? 'jpeg' : format.toLowerCase();
    const buffer = await sharp(req.file.buffer).toFormat(outputFormat).toBuffer();

    const originalName = path.parse(req.file.originalname).name;
    const outputFilename = `${originalName}.${format.toLowerCase()}`;

    res.set({
      'Content-Type': `image/${outputFormat}`,
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  } catch (error) {
    console.error('Image conversion error:', error);
    res.status(500).json({ error: 'Failed to convert image' });
  }
}

// Unit conversion controller
export function convertUnitHandler(req, res) {
  try {
    const { value, from, to, category } = req.body;

    if (value === undefined || !from || !to || !category) {
      return res.status(400).json({
        error: 'Missing required fields: value, from, to, category',
      });
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return res.status(400).json({ error: 'Value must be a number' });
    }

    const result = convertUnit(numValue, from, to, category);

    res.json({
      input: { value: numValue, unit: from },
      output: { value: result, unit: to },
      category,
    });
  } catch (error) {
    console.error('Unit conversion error:', error);
    res.status(400).json({ error: error.message });
  }
}

// Get unit categories and their units
export function getUnitInfo(req, res) {
  const categories = getCategories();
  const info = {};
  categories.forEach((cat) => {
    info[cat] = getUnits(cat);
  });
  res.json(info);
}

// Color conversion controller
export function convertColorHandler(req, res) {
  try {
    const { input, from, to } = req.body;

    if (!input || !from || !to) {
      return res.status(400).json({
        error: 'Missing required fields: input, from, to',
      });
    }

    const result = convertColor(input, from, to);

    res.json({
      input: { value: input, format: from },
      output: { value: result, format: to },
    });
  } catch (error) {
    console.error('Color conversion error:', error);
    res.status(400).json({ error: error.message });
  }
}

// Images to PDF conversion
export async function imagesToPdf(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      // Convert any image to PNG using sharp first for compatibility
      const pngBuffer = await sharp(file.buffer).png().toBuffer();
      const metadata = await sharp(file.buffer).metadata();

      const image = await pdfDoc.embedPng(pngBuffer);

      const pageWidth = metadata.width || 595;
      const pageHeight = metadata.height || 842;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="converted.pdf"',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  } catch (error) {
    console.error('Images to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert images to PDF' });
  }
}

// Merge PDFs
export async function mergePdfs(req, res) {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files are required' });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdf = await PDFDocument.load(file.buffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    const buffer = Buffer.from(pdfBytes);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="merged.pdf"',
      'Content-Length': buffer.length,
    });

    res.send(buffer);
  } catch (error) {
    console.error('Merge PDFs error:', error);
    res.status(500).json({ error: 'Failed to merge PDFs' });
  }
}

// PDF to Images
export async function pdfToImages(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No PDF files uploaded' });
    }

    const zip = new JSZip();
    let totalImages = 0;
    let singleBuffer = null;

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const pngPages = await pdfToPng(file.buffer, {
        viewportScale: 2.0
      });

      if (pngPages.length === 0) continue;

      const baseName = path.parse(file.originalname).name;
      const filePrefix = req.files.length > 1 ? `${baseName}_` : '';

      pngPages.forEach((page, index) => {
        const tempName = `${filePrefix}page_${index + 1}.png`;
        zip.file(tempName, page.content);
        totalImages++;
        singleBuffer = page.content;
      });
    }

    if (totalImages === 0) {
      return res.status(400).json({ error: 'Could not extract images from PDF' });
    }

    if (totalImages === 1) {
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="converted-page.png"',
        'Content-Length': singleBuffer.length,
      });
      return res.send(singleBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="converted-images.zip"',
      'Content-Length': zipBuffer.length,
    });
    res.send(zipBuffer);
  } catch (error) {
    console.error('PDF to Images error:', error);
    res.status(500).json({ error: 'Failed to convert PDF to images' });
  }
}

// Office Document to PDF
export async function officeToPdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document file uploaded' });
    }

    const originalName = req.file.originalname;

    // 1. Upload file to PDF24
    const formData = new FormData();
    formData.append('file', req.file.buffer, { filename: originalName });
    
    let options = { responseType: 'json', headers: formData.getHeaders() };
    const uploadRes = await axios.post('https://filetools2.pdf24.org/client.php?action=upload', formData, options);
    const files = uploadRes.data;

    if (!files || files.length === 0) {
      throw new Error('Upload to conversion service failed');
    }

    // 2. Start conversion job
    delete options.headers;
    const convertData = (await axios.post('https://filetools2.pdf24.org/client.php?action=convertToPdf', { files }, options)).data;
    options.params = convertData;

    // 3. Poll for status
    let jobStatusData = (await axios.get('https://filetools2.pdf24.org/client.php?action=getStatus', options)).data;
    
    let attempts = 0;
    while (jobStatusData.status !== 'done' && attempts < 30) { 
      // max 1 minute wait
      await new Promise(resolve => setTimeout(resolve, 2000));
      jobStatusData = (await axios.get('https://filetools2.pdf24.org/client.php?action=getStatus', options)).data;
      if (jobStatusData.status === 'error') {
         throw new Error('Service returned an error during conversion');
      }
      attempts++;
    }

    if (jobStatusData.status !== 'done') {
      throw new Error('Conversion timeout');
    }

    // 4. Download result
    options.responseType = 'arraybuffer';
    const finalPdf = (await axios.get('https://filetools2.pdf24.org/client.php?mode=download&action=downloadJobResult', options)).data;

    const baseName = path.parse(originalName).name;
    const finalFilename = `${baseName}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${finalFilename}"`,
      'Content-Length': finalPdf.length,
    });

    res.send(finalPdf);
  } catch (error) {
    console.error('Office to PDF API error:', error);
    res.status(500).json({ error: 'Failed to convert document. Service might be temporarily unavailable.' });
  }
}



// Audio conversion
export async function convertAudio(req, res) {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { format } = req.body;
    const allowedFormats = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];

    if (!format || !allowedFormats.includes(format.toLowerCase())) {
      return res.status(400).json({ error: `Invalid format. Allowed: ${allowedFormats.join(', ')}` });
    }

    const tmpDir = os.tmpdir();
    const ext = path.extname(req.file.originalname) || '.audio';
    inputPath = path.join(tmpDir, `audio_in_${Date.now()}${ext}`);
    outputPath = path.join(tmpDir, `audio_out_${Date.now()}.${format.toLowerCase()}`);

    await fs.writeFile(inputPath, req.file.buffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat(format.toLowerCase())
        .on('error', reject)
        .on('end', resolve)
        .save(outputPath);
    });

    const outputBuffer = await fs.readFile(outputPath);
    const originalName = path.parse(req.file.originalname).name;

    res.set({
      'Content-Type': `audio/${format.toLowerCase()}`,
      'Content-Disposition': `attachment; filename="${originalName}.${format.toLowerCase()}"`,
      'Content-Length': outputBuffer.length,
    });

    res.send(outputBuffer);
  } catch (error) {
    console.error('Audio conversion error:', error);
    res.status(500).json({ error: 'Failed to convert audio. Make sure ffmpeg is installed on the server.' });
  } finally {
    if (inputPath) fs.unlink(inputPath).catch(() => {});
    if (outputPath) fs.unlink(outputPath).catch(() => {});
  }
}

// Video conversion
export async function convertVideo(req, res) {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { format } = req.body;
    const allowedFormats = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'];

    if (!format || !allowedFormats.includes(format.toLowerCase())) {
      return res.status(400).json({ error: `Invalid format. Allowed: ${allowedFormats.join(', ')}` });
    }

    const tmpDir = os.tmpdir();
    const ext = path.extname(req.file.originalname) || '.video';
    inputPath = path.join(tmpDir, `video_in_${Date.now()}${ext}`);
    outputPath = path.join(tmpDir, `video_out_${Date.now()}.${format.toLowerCase()}`);

    await fs.writeFile(inputPath, req.file.buffer);

    await new Promise((resolve, reject) => {
      let cmd = ffmpeg(inputPath).toFormat(format.toLowerCase());

      // Format-specific codec settings
      if (format.toLowerCase() === 'mp4') {
        cmd = cmd.videoCodec('libx264').audioCodec('aac');
      } else if (format.toLowerCase() === 'webm') {
        cmd = cmd.videoCodec('libvpx-vp9').audioCodec('libopus');
      } else if (format.toLowerCase() === 'avi') {
        cmd = cmd.videoCodec('mpeg4').audioCodec('mp3');
      }

      cmd.on('error', reject).on('end', resolve).save(outputPath);
    });

    const outputBuffer = await fs.readFile(outputPath);
    const originalName = path.parse(req.file.originalname).name;

    const mimeTypes = {
      mp4: 'video/mp4', avi: 'video/x-msvideo', mov: 'video/quicktime',
      mkv: 'video/x-matroska', webm: 'video/webm', flv: 'video/x-flv',
    };

    res.set({
      'Content-Type': mimeTypes[format.toLowerCase()] || 'video/mp4',
      'Content-Disposition': `attachment; filename="${originalName}.${format.toLowerCase()}"`,
      'Content-Length': outputBuffer.length,
    });

    res.send(outputBuffer);
  } catch (error) {
    console.error('Video conversion error:', error);
    res.status(500).json({ error: 'Failed to convert video. Make sure ffmpeg is installed on the server.' });
  } finally {
    if (inputPath) fs.unlink(inputPath).catch(() => {});
    if (outputPath) fs.unlink(outputPath).catch(() => {});
  }
}
