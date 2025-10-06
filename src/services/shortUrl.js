import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const generateShortCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getExpiryTime = (expiry) => {
  switch (expiry) {
    case '1h': return 60 * 60 * 1000;
    case '24h': return 24 * 60 * 60 * 1000;
    case '15d': return 15 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    default: return 30 * 24 * 60 * 60 * 1000;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const chunkBase64 = (base64Data, chunkSize = 700000) => {
  const chunks = [];
  for (let i = 0; i < base64Data.length; i += chunkSize) {
    chunks.push(base64Data.slice(i, i + chunkSize));
  }
  return chunks;
};

const storeFileChunks = async (shortCode, file, base64Data) => {
  const chunks = chunkBase64(base64Data);
  const totalChunks = chunks.length;
  
  // Store main file metadata
  const mainDocRef = await addDoc(collection(db, 'shared_files'), {
    shortCode,
    originalName: file.name,
    fileSize: file.size,
    fileType: file.type,
    totalChunks,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + getExpiryTime(options.expiry || '30d')),
    hasPin: !!options.pin,
    pin: options.pin || null,
    views: 0,
    downloads: 0,
    isChunked: totalChunks > 1
  });
  
  // Store chunks
  for (let i = 0; i < chunks.length; i++) {
    await addDoc(collection(db, 'file_chunks'), {
      parentId: mainDocRef.id,
      shortCode,
      chunkIndex: i,
      chunkData: chunks[i],
      createdAt: new Date()
    });
  }
  
  return mainDocRef;
};

export const createShortUrl = async (file, options = {}) => {
  try {
    // Only allow PDFs and images
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      throw new Error('Only PDF and image files are supported');
    }
    
    // Check file size limit (50MB)
    if (file.size > 52428800) {
      throw new Error('File size must be under 50MB');
    }
    
    console.log('Uploading to Firestore:', file.name, 'Size:', file.size);
    const shortCode = generateShortCode();
    const base64Data = await fileToBase64(file);
    
    let docRef;
    
    // Check if file needs chunking (>700KB base64)
    if (base64Data.length > 700000) {
      docRef = await storeFileChunks(shortCode, file, base64Data);
    } else {
      // Store as single document
      docRef = await addDoc(collection(db, 'shared_files'), {
        shortCode,
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type,
        base64Data,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + getExpiryTime(options.expiry || '30d')),
        hasPin: !!options.pin,
        pin: options.pin || null,
        views: 0,
        downloads: 0,
        isChunked: false
      });
    }
    
    return {
      shortCode,
      shortUrl: `https://dropbeam.com/f/${shortCode}`,
      actualUrl: `${window.location.origin}/f/${shortCode}`,
      docId: docRef.id
    };
  } catch (error) {
    console.error('Error in createShortUrl:', error);
    throw error;
  }
};

const reassembleChunks = async (fileData) => {
  if (!fileData.isChunked) {
    return fileData.base64Data;
  }
  
  const chunksRef = collection(db, 'file_chunks');
  const q = query(chunksRef, where('parentId', '==', fileData.id));
  const querySnapshot = await getDocs(q);
  
  const chunks = [];
  querySnapshot.docs.forEach(doc => {
    const chunkData = doc.data();
    chunks[chunkData.chunkIndex] = chunkData.chunkData;
  });
  
  return chunks.join('');
};

export const getFileByShortCode = async (shortCode) => {
  try {
    const filesRef = collection(db, 'shared_files');
    const q = query(filesRef, where('shortCode', '==', shortCode));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('File not found');
    }
    
    const docData = querySnapshot.docs[0];
    const data = docData.data();
    
    if (data.expiresAt.toDate() < new Date()) {
      throw new Error('File has expired');
    }
    
    // Reassemble chunks if needed
    const base64Data = await reassembleChunks({ id: docData.id, ...data });
    
    return { id: docData.id, ...data, base64Data };
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

export const incrementViews = async (docId) => {
  try {
    const docRef = doc(db, 'shared_files', docId);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};

export const incrementDownloads = async (docId) => {
  try {
    const docRef = doc(db, 'shared_files', docId);
    await updateDoc(docRef, {
      downloads: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing downloads:', error);
  }
};

export const verifyFilePin = async (shortCode, pin) => {
  try {
    const fileData = await getFileByShortCode(shortCode);
    
    if (!fileData.hasPin) {
      return { success: true, fileData };
    }
    
    if (fileData.pin === pin) {
      return { success: true, fileData };
    }
    
    return { success: false, error: 'Invalid PIN' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteFile = async (fileId) => {
  try {
    // Delete main file document
    await deleteDoc(doc(db, 'shared_files', fileId));
    
    // Delete associated chunks if any
    const chunksRef = collection(db, 'file_chunks');
    const q = query(chunksRef, where('parentId', '==', fileId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(chunkDoc => 
      deleteDoc(doc(db, 'file_chunks', chunkDoc.id))
    );
    
    await Promise.all(deletePromises);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

export const getUserFiles = async () => {
  try {
    const filesRef = collection(db, 'shared_files');
    const querySnapshot = await getDocs(filesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      expiresAt: doc.data().expiresAt?.toDate()
    }));
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
};

