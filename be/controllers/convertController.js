import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { convertUnit, getCategories, getUnits } from '../utils/unitConverter.js';
import { convertColor } from '../utils/colorConverter.js';

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
