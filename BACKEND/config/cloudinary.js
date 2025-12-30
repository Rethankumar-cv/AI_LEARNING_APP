const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify configuration on startup
const verifyCloudinaryConfig = () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
        console.warn('⚠️  Cloudinary credentials not configured. Using local storage fallback.');
        return false;
    }
    console.log('✅ Cloudinary configured successfully');
    return true;
};

// Create storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ai-learning-documents',
        allowed_formats: ['pdf', 'txt'],
        resource_type: 'raw', // For non-image files (PDF, TXT)
        access_mode: 'public', // Make files publicly accessible
        public_id: (req, file) => {
            // Generate unique filename
            const timestamp = Date.now();
            const random = Math.round(Math.random() * 1E9);
            const ext = file.originalname.split('.').pop();
            return `${timestamp}-${random}.${ext}`;
        },
    },
});

module.exports = {
    cloudinary,
    storage,
    verifyCloudinaryConfig,
};
