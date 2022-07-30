const fs = require('fs');
const { upload_image } = require('../../config/cloudinary');
const { imageUpload } = require('../../config/multer');
const { failedRes, successfulRes } = require('../../utils/response');

const { authN } = require('../../middlewares/authN');

const router = require('express').Router();

router.post('/upload-photo', authN, imageUpload.single('photo'), async (req, res) => {
  try {
    const file = req.file;
    const user = req.session.user;
    const folderName = req.body.folderName ? req.body.folderName : 'photos';
    const photoName = `${new Date().toISOString()}-${user.id}`;

    const url = await upload_image(file.path, photoName, folderName);
    if (fs.existsSync(file.path)) {
      fs.rmSync(file.path);
    }
    return successfulRes(res, 200, { photo_url: url });
  } catch (e) {
    return failedRes(res, 500, e);
  }
});

module.exports = router;
