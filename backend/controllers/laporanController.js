const Laporan = require('../models/Laporan');
const mongoose = require('mongoose');
const Log = require('../models/Log');

exports.createLaporan = async (req, res) => {
  try {
    const { nama_merk, npwpd, alamat, hasil_pemeriksaan, foto } = req.body;
    if (!nama_merk || !npwpd || !alamat || !hasil_pemeriksaan) {
      return res.status(400).json({ msg: 'Semua field wajib diisi' });
    }
    let fotoArr = [];
    if (Array.isArray(foto)) {
      fotoArr = foto;
    } else if (typeof foto === 'string' && foto) {
      fotoArr = [foto];
    }
    const laporan = new Laporan({
      nama_merk,
      npwpd,
      alamat,
      hasil_pemeriksaan,
      user: req.user.id,
      foto: fotoArr
    });
    await laporan.save();
    res.status(201).json(laporan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllLaporan = async (req, res) => {
  try {
    const laporan = await Laporan.find().populate('user', 'nama username jabatan').sort({ createdAt: -1 });
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getLaporanById = async (req, res) => {
  try {
    const laporan = await Laporan.findById(req.params.id).populate('user', 'nama username jabatan');
    if (!laporan) return res.status(404).json({ msg: 'Laporan tidak ditemukan' });
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateStatusLaporan = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Belum Dicek', 'Disetujui', 'Ditolak'].includes(status)) {
      return res.status(400).json({ msg: 'Status tidak valid' });
    }
    const laporan = await Laporan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!laporan) return res.status(404).json({ msg: 'Laporan tidak ditemukan' });
    // Catat log jika status Disetujui/Ditolak
    if (status === 'Disetujui' || status === 'Ditolak') {
      await catatLog(laporan._id, status === 'Disetujui' ? 'Disetujui' : 'Ditolak', req.user.id);
    }
    res.json(laporan);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Delete laporan id:', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ msg: 'ID tidak valid' });
    }
    const laporan = await Laporan.findByIdAndDelete(id);
    if (!laporan) return res.status(404).json({ msg: 'Laporan tidak ditemukan' });
    res.status(200).json({ msg: 'Laporan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 

exports.logActivity = async (req, res) => {
  try {
    const { laporanId, aktivitas } = req.body;
    if (!['Disetujui','Ditolak','Dicetak'].includes(aktivitas)) {
      return res.status(400).json({ msg: 'Aktivitas tidak valid' });
    }
    const log = new Log({
      petugas: req.user.id,
      laporan: laporanId,
      aktivitas
    });
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Helper untuk mencatat log otomatis
async function catatLog(laporanId, aktivitas, userId) {
  try {
    const log = new Log({
      petugas: userId,
      laporan: laporanId,
      aktivitas
    });
    await log.save();
  } catch {}
} 