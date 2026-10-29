import { v2 as cloudinary } from 'cloudinary';

class UploadService {
  constructor() {
    this.isConfigured = false;
    this.init();
  }

  init() {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (
      CLOUDINARY_CLOUD_NAME &&
      CLOUDINARY_API_KEY &&
      CLOUDINARY_API_SECRET &&
      !CLOUDINARY_CLOUD_NAME.includes('your_')
    ) {
      cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
      });
      this.isConfigured = true;
    } else {
      console.log('ℹ️ Cloudinary credentials not configured. Using data URI fallback for uploads.');
    }
  }

  async uploadSingleBuffer(fileBuffer, mimetype) {
    if (this.isConfigured) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'rentkart/listings',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
    }

    // Graceful fallback for local development without active Cloudinary account
    const base64Data = fileBuffer.toString('base64');
    return `data:${mimetype};base64,${base64Data}`;
  }

  async uploadMultiple(files = []) {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file) =>
      this.uploadSingleBuffer(file.buffer, file.mimetype)
    );

    return Promise.all(uploadPromises);
  }
}

export const uploadService = new UploadService();
