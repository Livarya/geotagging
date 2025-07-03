const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nik, nama, jabatan, username, email, password } = req.body;
    if (!nik || !nama || !jabatan || !username || !email || !password) {
      return res.status(400).json({ msg: 'Semua field wajib diisi' });
    }
    const existingUser = await User.findOne({ $or: [ { email }, { username }, { nik } ] });
    if (existingUser) {
      return res.status(400).json({ msg: 'User sudah terdaftar' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ nik, nama, jabatan, username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ msg: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ msg: 'Semua field wajib diisi' });
    }
    const user = await User.findOne({ $or: [ { email: identifier }, { username: identifier } ] });
    if (!user) {
      return res.status(400).json({ msg: 'User tidak ditemukan' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Password salah' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'supersecretjwtkey', { expiresIn: '1d' });
    res.json({
      token,
      user: {
        nama: user.nama,
        role: user.role,
        jabatan: user.jabatan,
        email: user.email,
        username: user.username
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 