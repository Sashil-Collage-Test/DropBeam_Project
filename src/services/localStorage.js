const generateShortCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const createShortUrlLocal = async (file, options = {}) => {
  try {
    console.log('Using local storage for:', file.name);
    
    const shortCode = generateShortCode();
    const base64Data = await fileToBase64(file);
    
    const fileData = {
      shortCode,
      originalName: file.name,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      base64Data,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (options.expiryHours || 24) * 60 * 60 * 1000).toISOString(),
      hasPin: !!options.pin,
      pin: options.pin || null,
      views: 0,
      downloads: 0,
      isActive: true
    };
    
    localStorage.setItem(`file_${shortCode}`, JSON.stringify(fileData));
    
    return {
      shortCode,
      shortUrl: `${window.location.origin}/f/${shortCode}`,
      downloadURL: `local://${shortCode}`,
      docId: shortCode
    };
  } catch (error) {
    console.error('Error in local storage:', error);
    throw error;
  }
};

export const getLocalFile = (shortCode) => {
  const fileData = localStorage.getItem(`file_${shortCode}`);
  return fileData ? JSON.parse(fileData) : null;
};

export const getAllLocalFiles = () => {
  const files = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('file_')) {
      const fileData = localStorage.getItem(key);
      if (fileData) {
        files.push(JSON.parse(fileData));
      }
    }
  }
  return files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};