import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { pdfToPng } from 'pdf-to-png-converter';
import JSZip from 'jszip';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';
import { execFile } from 'child_process';
import util from 'util';
import { convertUnit, getCategories, getUnits } from '../utils/unitConverter.js';
import { convertColor } from '../utils/colorConverter.js';

const execFileAsync = util.promisify(execFile);

// Image conversion controller
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

    const libreOfficePath = process.platform === 'win32'
      ? 'C:\\Program Files\\LibreOffice\\program\\soffice.exe'
      : 'soffice';

    // Verify libreoffice exists on windows
    if (process.platform === 'win32' && !fsSync.existsSync(libreOfficePath)) {
      throw new Error('LibreOffice is not installed at the default path');
    }

    const tempDir = os.tmpdir();
    const sessionId = Date.now() + '-' + Math.round(Math.random() * 1e9);
    
    // original name vs temp
    let originalExt = path.extname(req.file.originalname) || '.docx';
    const inputFilePath = path.join(tempDir, `input_${sessionId}${originalExt}`);
    const outputFileName = `input_${sessionId}.pdf`;
    const outputFilePath = path.join(tempDir, outputFileName);

    // Write the buffer to temp file
    await fs.writeFile(inputFilePath, req.file.buffer);

    try {
      // Execute local libreoffice commands directly
      await execFileAsync(libreOfficePath, [
        '--headless',
        '--convert-to', 'pdf',
        '--outdir', tempDir,
        inputFilePath
      ]);

      // Verify the PDF was made
      const pdfBuffer = await fs.readFile(outputFilePath);

      const baseName = path.parse(req.file.originalname).name;
      const finalFilename = `${baseName}.pdf`;

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${finalFilename}"`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } finally {
      // Cleanup files quietly
      try {
        if (fsSync.existsSync(inputFilePath)) await fs.unlink(inputFilePath);
        if (fsSync.existsSync(outputFilePath)) await fs.unlink(outputFilePath);
      } catch (cleanErr) {
        console.error('Cleanup error:', cleanErr);
      }
    }
  } catch (error) {
    console.error('Office to PDF error:', error);
    res.status(500).json({ error: 'Failed to convert document. Make sure LibreOffice is installed.' });
  }
}


