const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Product = require('../models/Product');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

const buildImagePath = (req, file) =>
  file ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}` : null;

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, affiliateLink, imageUrl } = req.body;
    const image = buildImagePath(req, req.file) || imageUrl;

    if (!image) {
      return res.status(400).json({ message: 'Image file or imageUrl is required.' });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      affiliateLink,
      image,
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to create product.' });
  }
});

router.get('/', async (_, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, affiliateLink, imageUrl } = req.body;
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updatedData = {
      name: name ?? existing.name,
      price: price ?? existing.price,
      description: description ?? existing.description,
      category: category ?? existing.category,
      affiliateLink: affiliateLink ?? existing.affiliateLink,
      image: buildImagePath(req, req.file) || imageUrl || existing.image,
    };

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to update product.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }
});

module.exports = router;
