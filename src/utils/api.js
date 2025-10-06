import { createShortUrl, verifyFilePin } from '../services/shortUrl';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const uploadFile = async (file, options = {}) => {
  try {
    console.log('API uploadFile called with:', file.name, file.size);
    
    const uploadOptions = {
      pin: options.pin || null,
      expiryHours: options.expiryHours || 24
    };
    
    const result = await createShortUrl(file, uploadOptions);
    
    return {
      shortCode: result.shortCode,
      shortUrl: result.shortUrl,
      downloadURL: result.downloadURL,
      success: true
    };
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error(error.message || 'Upload failed');
  }
};

export const verifyPin = async (shortCode, pin) => {
  try {
    const result = await verifyFilePin(shortCode, pin);
    
    if (result.success) {
      return {
        success: true,
        fileData: result.fileData
      };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    throw new Error(error.message || 'Verification failed');
  }
};



export const downloadFile = (shortCode) => {
  return `${window.location.origin}/f/${shortCode}`;
};

