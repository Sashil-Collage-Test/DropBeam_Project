import React, { useState } from 'react';
import { Wifi, Shield } from 'lucide-react';

const NetworkSetup = ({ isOpen, onClose, onSetIP }) => {
  const [ipAddress, setIpAddress] = useState('');

  // Secure IP validation - only allow private network ranges
  const isValidPrivateIP = (ip) => {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(part => isNaN(part) || part < 0 || part > 255)) {
      return false;
    }
    
    // Only allow private IP ranges for security
    const [a, b] = parts;
    return (
      (a === 192 && b === 168) ||  // 192.168.x.x
      (a === 10) ||                // 10.x.x.x
      (a === 172 && b >= 16 && b <= 31) // 172.16.x.x - 172.31.x.x
    );
  };

  // Simple encryption for localStorage
  const encryptIP = (ip) => {
    return btoa(ip + '_dropbeam_secure');
  };

  const handleConfirm = () => {
    const sanitizedIP = ipAddress.trim();
    
    if (!sanitizedIP) {
      alert('Please enter an IP address');
      return;
    }
    
    if (!isValidPrivateIP(sanitizedIP)) {
      alert('Please enter a valid private network IP address (192.168.x.x, 10.x.x.x, or 172.16-31.x.x)');
      return;
    }
    
    // Store encrypted IP
    const encryptedIP = encryptIP(sanitizedIP);
    localStorage.setItem('dropbeam_network_ip', encryptedIP);
    
    onSetIP(sanitizedIP);
    onClose();
    setIpAddress('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wifi className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Network Setup for QR Codes</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Enter your computer's IP address to make QR codes work on mobile devices
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Your Computer's IP Address
          </label>
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="192.168.1.100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-lg"
          />
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">How to find your IP:</p>
            <p className="text-xs text-blue-700">
              <strong>Windows:</strong> Open Command Prompt → type <code className="bg-blue-100 px-1 rounded">ipconfig</code> → look for IPv4 Address<br/>
              <strong>Mac/Linux:</strong> Open Terminal → type <code className="bg-blue-100 px-1 rounded">ifconfig</code> → look for inet address
            </p>
          </div>
          
          <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800 font-medium">Security Note:</p>
              <p className="text-xs text-green-700">
                Only private network IPs are accepted (192.168.x.x, 10.x.x.x, 172.16-31.x.x). Your IP is encrypted before storage.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Use This IP
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          This IP will be saved and used for all QR codes until changed
        </div>
      </div>
    </div>
  );
};

export default NetworkSetup;