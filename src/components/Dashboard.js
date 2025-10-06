import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Image, Link, Download, Eye, Files, X, Cloud, Copy, CheckCircle, BarChart3, Settings, Users, Globe, TrendingUp, Calendar, Filter, Search, Grid, List, Plus, Share2, Lock, Clock, Trash2, Edit3, Star, AlertCircle, Zap, Database, Shield } from 'lucide-react';
import { uploadFile } from '../utils/api';
import { getUserFiles } from '../services/fileService';

const Dashboard = ({ onNavigate }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [realFiles, setRealFiles] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const files = await getUserFiles();
    setRealFiles(files);
  };

  const calculateStorage = () => {
    const totalBytes = realFiles.reduce((sum, file) => sum + (file.fileSize || 0), 0);
    const totalGB = totalBytes / (1024 * 1024 * 1024);
    const maxGB = 10;
    const usedPercentage = Math.min((totalGB / maxGB) * 100, 100);
    
    return {
      used: totalGB.toFixed(1),
      available: (maxGB - totalGB).toFixed(1),
      percentage: usedPercentage.toFixed(0),
      fileCount: realFiles.length
    };
  };

  const storage = calculateStorage();

  const getAnalyticsData = () => {
    const totalViews = realFiles.reduce((sum, file) => sum + (file.views || 0), 0);
    const totalDownloads = realFiles.reduce((sum, file) => sum + (file.downloads || 0), 0);
    const avgViews = realFiles.length > 0 ? Math.round(totalViews / realFiles.length) : 0;
    
    return {
      totalViews,
      totalDownloads,
      avgViews,
      totalFiles: realFiles.length,
      storageUsed: storage.used,
      recentUploads: realFiles.filter(f => {
        const uploadDate = f.createdAt?.toDate?.() || new Date(f.createdAt);
        const daysDiff = (new Date() - uploadDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
      }).length
    };
  };

  const analytics = getAnalyticsData();

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length !== selectedFiles.length) {
      alert('Only PDF and image files are supported');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length !== droppedFiles.length) {
      alert('Only PDF and image files are supported');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <Image className="w-6 h-6 text-blue-500" />;
    return <FileText className="w-6 h-6 text-red-500" />;
  };

  const handleRealUpload = async (file) => {
    try {
      setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));
      
      setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
      const result = await uploadFile(file);
      
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      
      loadFiles();
      
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 1500);
    } catch (error) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
      
      alert(`Upload failed: ${error.message}`);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    for (const file of files) {
      await handleRealUpload(file);
    }
    setFiles([]);
  };

  const copyToClipboard = (text, fileId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(fileId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const filteredFiles = realFiles.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'images' && file.originalName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ||
      (filterType === 'pdfs' && file.originalName.match(/\.pdf$/i));
    return matchesSearch && matchesFilter;
  });

  const sidebarItems = [
    { id: 'upload', label: 'Upload Files', icon: Upload, color: 'blue' },
    { id: 'files', label: 'My Files', icon: Files, color: 'green', badge: realFiles.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'purple' },
    { id: 'storage', label: 'Storage', icon: Database, color: 'orange' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'gray' }
  ];

  const renderUploadSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Upload className="w-7 h-7 text-blue-600" />
          Upload Files
        </h2>
        
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-16 h-16 text-gray-400 group-hover:text-blue-500 mx-auto mb-4 transition-colors" />
          <p className="text-xl text-gray-600 mb-2">Drop files here or click to browse</p>
          <p className="text-sm text-gray-500">Only PDF and image files supported • Max 50MB per file</p>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,image/*" className="hidden" onChange={handleFileSelect} />
        </div>

        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-4">Selected Files ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.name)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeFile(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            
            {Object.keys(uploadProgress).length > 0 && (
              <div className="mt-6 space-y-3">
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{fileName}</span>
                      <span className="text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: progress + '%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={Object.keys(uploadProgress).length > 0}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              {Object.keys(uploadProgress).length > 0 ? 'Uploading...' : 'Upload All Files'}
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Files className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{realFiles.length}</p>
              <p className="text-sm text-gray-500">Total Files</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
              <p className="text-sm text-gray-500">Total Views</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalDownloads}</p>
              <p className="text-sm text-gray-500">Downloads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFilesSection = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Files</option>
              <option value="images">Images</option>
              <option value="pdfs">PDFs</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Files Grid/List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Files ({filteredFiles.length})</h2>
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{selectedFiles.length} selected</span>
              <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm">
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {filteredFiles.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredFiles.map((file) => (
              <div key={file.id} className={`border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
                <div className={`flex items-center gap-4 ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles(prev => [...prev, file.id]);
                      } else {
                        setSelectedFiles(prev => prev.filter(id => id !== file.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  {getFileIcon(file.originalName)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{file.originalName}</h3>
                    <p className="text-sm text-gray-500">{formatFileSize(file.fileSize)} • {file.createdAt?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-4 ${viewMode === 'list' ? '' : 'mb-4'}`}>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {file.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {file.downloads || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'min-w-0' : ''}`}>
                  <input
                    type="text"
                    value={`https://dropbeam.com/f/${file.shortCode}`}
                    readOnly
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                  <button 
                    onClick={() => copyToClipboard(`${window.location.origin}/f/${file.shortCode}`, file.id)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    {copiedId === file.id ? (
                      <><CheckCircle className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Files className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No files found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalViews}</p>
          <p className="text-sm text-gray-500">Total Views</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalDownloads}</p>
          <p className="text-sm text-gray-500">Downloads</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">{analytics.avgViews} avg</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalFiles}</p>
          <p className="text-sm text-gray-500">Total Files</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-green-600">This week</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.recentUploads}</p>
          <p className="text-sm text-gray-500">Recent Uploads</p>
        </div>
      </div>

      {/* Top Files */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Files</h3>
        <div className="space-y-4">
          {realFiles
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
            .map((file, index) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                    #{index + 1}
                  </div>
                  {getFileIcon(file.originalName)}
                  <div>
                    <p className="font-medium">{file.originalName}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.fileSize)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {file.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {file.downloads || 0}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderStorageSection = () => (
    <div className="space-y-6">
      {/* Storage Overview */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Database className="w-7 h-7 text-orange-600" />
          Storage Management
        </h2>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium text-gray-700">Storage Usage</span>
            <span className="text-lg font-bold text-gray-900">{storage.used} GB / 10 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500" 
              style={{ width: `${storage.percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{storage.percentage}% used</span>
            <span>{storage.available} GB available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <Files className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-blue-600">{storage.fileCount}</p>
            <p className="text-sm text-gray-600">Total Files</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <Zap className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-green-600">{storage.used} GB</p>
            <p className="text-sm text-gray-600">Used Space</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <p className="text-2xl font-bold text-purple-600">{storage.available} GB</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
        </div>
      </div>

      {/* Storage by File Type */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Storage by File Type</h3>
        <div className="space-y-4">
          {['Images', 'PDFs', 'Others'].map((type, index) => {
            const percentage = [65, 30, 5][index];
            const color = ['blue', 'red', 'gray'][index];
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 bg-${color}-500 rounded`}></div>
                  <span className="font-medium">{type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-500 w-12">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSettingsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Settings className="w-7 h-7 text-gray-600" />
          Settings
        </h2>
        
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Auto-generate short links</p>
                  <p className="text-sm text-gray-500">Automatically create short links for uploaded files</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Enable file expiry</p>
                  <p className="text-sm text-gray-500">Files will be automatically deleted after 30 days</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
          </div>
          
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Track analytics</p>
                  <p className="text-sm text-gray-500">Collect view and download statistics</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Public file listing</p>
                  <p className="text-sm text-gray-500">Allow files to be discovered publicly</p>
                </div>
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-700">Clear all data</p>
                    <p className="text-sm text-red-600">Permanently delete all uploaded files and data</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'upload': return renderUploadSection();
      case 'files': return renderFilesSection();
      case 'analytics': return renderAnalyticsSection();
      case 'storage': return renderStorageSection();
      case 'settings': return renderSettingsSection();
      default: return renderUploadSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onNavigate} 
              className="flex items-center gap-3 text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              DropBeam
            </button>
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                {storage.fileCount} files • {storage.used} GB used
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
                <span className="text-sm font-medium text-gray-700">User</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;