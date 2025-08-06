// const AWS = require('aws-sdk');
// const { v4: uuidv4 } = require('uuid');
// const path = require('path');

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// exports.uploadToS3 = (file, folder) => {
//   const fileExtension = path.extname(file.originalname);
//   const fileName = `${folder}/${uuidv4()}${fileExtension}`;

//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET_NAME,
//     Key: fileName,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: 'public-read', // To make uploaded media accessible via URL
//   };

//   return new Promise((resolve, reject) => {
//     s3.upload(params, (err, data) => {
//       if (err) return reject(err);
//       resolve(data.Location); // return public URL
//     });
//   });
// };

// utils/s3Upload.js
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Upload to S3
const uploadToS3 = (file, folder) => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${folder}/${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(err);
      resolve(data.Location); // return public URL
    });
  });
};

// Delete from S3
const deleteFromS3 = async (url) => {
  if (!url) return;
  
  try {
    let key;
    
    // Handle both URL strings and direct paths
    if (url.startsWith('http')) {
      try {
        const urlObj = new URL(url);
        key = urlObj.pathname.substring(1); // Remove leading slash
      } catch (err) {
        // If URL parsing fails, try to extract the key directly
        const bucketIndex = url.indexOf('holidayhomesdatabase/');
        key = bucketIndex !== -1 ? url.substring(bucketIndex + 'holidayhomesdatabase/'.length) : url;
      }
    } else {
      // Assume it's already a key if not a URL
      key = url;
    }

    // Decode any URL-encoded characters
    key = decodeURIComponent(key);
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || 'holidayhomesdatabase',
      Key: key
    };
    
    await s3.deleteObject(params).promise();
    return true;
  } catch (err) {
    console.error('S3 deletion error:', {
      url,
      error: err.message,
      stack: err.stack
    });
    throw err;
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3
};