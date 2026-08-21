function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }

  console.error(err);
  res.status(500).json({ message: 'Lỗi server' });
}

module.exports = errorHandler;
