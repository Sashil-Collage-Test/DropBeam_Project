import { getUserFiles as getSharedFiles } from './shortUrl';

export const getUserFiles = async () => {
  try {
    return await getSharedFiles();
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
};