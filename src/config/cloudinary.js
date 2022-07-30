const { cloudinary_name, cloudinary_api_key, cloudinary_api_secret } = require('./env');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: cloudinary_name,
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

exports.upload_image = async (imagePath, imageName, tag) => {
  const video = await cloudinary.uploader.upload(
    imagePath,
    {
      resource_type: 'image',
      public_id: `et3_media/${tag}/${imageName}`,
      overwrite: true,
      tags: `${tag}`,
    },
    function (err, result) {
      if (err) {
        console.log(err);
        return err;
      }
    }
  );
  return video.url;
};
