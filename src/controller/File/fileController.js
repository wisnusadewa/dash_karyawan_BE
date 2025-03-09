const { getUserPhotoService } = require('./fileService');

const getUserPhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('User ID dari request:', userId); // Debugging

    if (!userId) {
      return res.status(400).json({ message: 'User ID tidak ditemukan!' });
    }

    const filePath = await getUserPhotoService(userId);
    res.sendFile(filePath);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { getUserPhoto };
