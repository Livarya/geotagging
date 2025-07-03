const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');
const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: path.join(__dirname, '../uploads'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('File harus gambar'));
    }
    cb(null, true);
  }
});
const {
  createLaporan,
  getUserLaporan,
  getAllLaporan,
  getLaporanById,
  updateStatusLaporan,
  deleteLaporan
} = require('../controllers/laporanController');

router.post('/upload', auth, upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });
  res.json({ filename: req.file.filename });
});

router.post('/', auth, createLaporan);
router.get('/user', auth, getUserLaporan);
router.get('/', auth, isAdmin, getAllLaporan);
router.get('/:id', auth, getLaporanById);
router.put('/:id/status', auth, isAdmin, updateStatusLaporan);
router.delete('/:id', auth, isAdmin, deleteLaporan);

module.exports = router; 