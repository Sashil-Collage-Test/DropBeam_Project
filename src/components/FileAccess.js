import React, { useState, useEffect } from 'react';
import { Download, Eye, Lock, FileText } from 'lucide-react';
import { getFileByShortCode, incrementViews, incrementDownloads, verifyFilePin } from '../services/shortUrl';

const FileAccess = ({ shortCode }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pin, setPin] = useState('');
  const [needsPin, setNeedsPin] = useState(false);

  useEffect(() => {
    loadFile();
  }, [shortCode]);

  const loadFile = async () => {
    try {
      const fileData = await getFileByShortCode(shortCode);
      
      if (fileData.hasPin) {
        setNeedsPin(true);
        setFile(fileData);
      } else {
        setFile(fileData);
        await incrementViews(fileData.id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async () => {
    try {
      const result = await verifyFilePin(shortCode, pin);
      if (result.success) {
        setNeedsPin(false);
        await incrementViews(file.id);
      } else {
        alert('Invalid PIN');
      }
    } catch (err) {
      alert('PIN verification failed');
    }
  };

  const handleDownload = async () => {
    if (file && file.base64Data) {
      const link = document.createElement('a');
      link.href = file.base64Data;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      await incrementDownloads(file.id);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  if (needsPin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Protected File</h2>
            <p className="text-gray-600 mt-2">Enter PIN to access this file</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handlePinSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Access File
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isImage = file.originalName.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPDF = file.originalName.match(/\.pdf$/i);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{file.originalName}</h2>
              <p className="text-gray-600 mt-1">File size: {(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {file.views} views
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {file.downloads} downloads
            </span>
          </div>
        </div>
        
        {/* File Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {isImage && (
            <div className="text-center">
              <img 
                src={file.base64Data} 
                alt={file.originalName}
                className="max-w-full max-h-screen mx-auto rounded-lg shadow-md"
                style={{ maxHeight: '80vh' }}
              />
            </div>
          )}
          
          {isPDF && (
            <div className="w-full" style={{ height: '80vh' }}>
              <iframe
                src={file.base64Data}
                className="w-full h-full border-0 rounded-lg"
                title={file.originalName}
              />
            </div>
          )}
          
          {!isImage && !isPDF && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg">Preview not available</p>
              <p className="text-gray-500 text-sm mt-2">Click download to view this file</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileAccess;