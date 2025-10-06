import React, { useState } from 'react';
import { Lock, Shield, X } from 'lucide-react';

const PinSetup = ({ isOpen, onClose, onSetPin, fileName }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [expiryOption, setExpiryOption] = useState('30d');

  const handlePinChange = (value, isConfirm = false) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    if (isConfirm) {
      setConfirmPin(numericValue);
    } else {
      setPin(numericValue);
    }
    setError('');
  };

  const handleSubmit = () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    onSetPin({ pin, expiry: expiryOption });
    onClose();
  };

  const handleSkip = () => {
    onSetPin({ pin: null, expiry: expiryOption });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Secure Your File</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Add a PIN to protect:</p>
          <p className="font-medium text-gray-900 truncate">{fileName}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set PIN (4-6 digits)
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                placeholder="Enter PIN"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm PIN
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => handlePinChange(e.target.value, true)}
                placeholder="Confirm PIN"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Expiry
            </label>
            <select
              value={expiryOption}
              onChange={(e) => setExpiryOption(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1h">1 Hour</option>
              <option value="24h">24 Hours</option>
              <option value="15d">15 Days</option>
              <option value="30d">30 Days</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Skip (No PIN)
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Set PIN
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          PIN protection adds an extra layer of security to your shared files
        </div>
      </div>
    </div>
  );
};

export default PinSetup;