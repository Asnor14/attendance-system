import { useState } from 'react';
import { MdWifi, MdSync, MdCheckCircle, MdCancel } from 'react-icons/md';

const Settings = () => {
  const [autoSync, setAutoSync] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const testRaspberryPiConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);

    // Simulate connection test
    setTimeout(() => {
      // In production, make actual API call to Raspberry Pi
      const success = Math.random() > 0.5; // Simulate random result
      setConnectionStatus(success ? 'success' : 'failed');
      setTestingConnection(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-dark">Settings</h1>

      <div className="space-y-6">
        {/* Raspberry Pi Connection Test */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-brand-orange/20">
          <div className="flex items-center space-x-3 mb-4">
            <MdWifi className="text-3xl text-brand-orange" />
            <h2 className="text-xl font-semibold text-brand-dark">Raspberry Pi Connection</h2>
          </div>
          <p className="text-brand-charcoal/70 mb-4">
            Test the connection with your Raspberry Pi kiosk devices
          </p>
          <button
            onClick={testRaspberryPiConnection}
            disabled={testingConnection}
            className="flex items-center space-x-2 bg-brand-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/30"
          >
            {testingConnection ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <MdWifi />
                <span>Test Connection</span>
              </>
            )}
          </button>
          {connectionStatus === 'success' && (
            <div className="mt-4 flex items-center space-x-2 text-green-600">
              <MdCheckCircle />
              <span>Connection successful!</span>
            </div>
          )}
          {connectionStatus === 'failed' && (
            <div className="mt-4 flex items-center space-x-2 text-red-600">
              <MdCancel />
              <span>Connection failed. Please check your Raspberry Pi configuration.</span>
            </div>
          )}
        </div>

        {/* Auto Sync Toggle */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-brand-orange/20">
          <div className="flex items-center space-x-3 mb-4">
            <MdSync className="text-3xl text-brand-orange" />
            <h2 className="text-xl font-semibold text-brand-dark">Auto Sync</h2>
          </div>
          <p className="text-brand-charcoal/70 mb-4">
            Automatically sync data with Raspberry Pi devices
          </p>
          <label className="flex items-center space-x-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`block w-14 h-8 rounded-full transition-colors ${
                  autoSync ? 'bg-brand-orange' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                    autoSync ? 'transform translate-x-6' : ''
                  }`}
                ></div>
              </div>
            </div>
            <span className="text-brand-charcoal font-medium">
              {autoSync ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-brand-orange/20">
          <h2 className="text-xl font-semibold text-brand-dark mb-4">System Information</h2>
          <div className="space-y-2 text-brand-charcoal/80">
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>API Endpoint:</span>
              <span className="font-mono text-sm text-brand-dark">http://localhost:5000</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="font-medium">SQLite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

