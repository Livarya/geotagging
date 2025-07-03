const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { nik, nama, jabatan, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nik, nama, jabatan, email },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'Semua field wajib diisi' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'Konfirmasi password tidak cocok' });
    }
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Password lama salah' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ msg: 'Password berhasil diubah' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}; 