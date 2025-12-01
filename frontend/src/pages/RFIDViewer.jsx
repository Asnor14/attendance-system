import { useState, useEffect } from 'react';
import { rfidAPI } from '../api/rfid';
import { MdRefresh, MdContentCopy, MdQrCodeScanner, MdCheckCircle, MdCancel } from 'react-icons/md';

const RFIDViewer = () => {
  const [rfidData, setRfidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRfid();
    const interval = setInterval(fetchRfid, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRfid = async () => {
    try {
      const data = await rfidAPI.getLive();
      setRfidData(data);
    } catch (error) {
      console.error('Failed to fetch RFID:', error);
      setRfidData({ uid: null, timestamp: null, isActive: false });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (rfidData?.uid) {
      try {
        await navigator.clipboard.writeText(rfidData.uid);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        alert('Failed to copy to clipboard');
      }
    }
  };

  const clearRfid = async () => {
    try {
      await rfidAPI.clear();
      fetchRfid();
    } catch (error) {
      alert('Failed to clear RFID');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-dark">RFID Scanner (ESP8266 Viewer)</h1>

      <div className="max-w-2xl mx-auto">
        {/* Main RFID Display Card */}
        <div className="bg-gradient-to-br from-brand-dark via-brand-charcoal to-brand-orange rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center">
            <div className="inline-block p-4 bg-white bg-opacity-20 rounded-full mb-4">
              <MdQrCodeScanner className="text-6xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Live RFID UID</h2>
            <p className="text-brand-beige/80 mb-6">Waiting for ESP8266 to send RFID data...</p>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : rfidData?.uid && rfidData?.isActive ? (
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-brand-beige/80 text-sm mb-2">RFID UID</p>
                  <p className="text-4xl font-mono font-bold text-white break-all">
                    {rfidData.uid}
                  </p>
                </div>
                {rfidData.timestamp && (
                  <p className="text-brand-beige/70 text-sm">
                    Last updated: {new Date(rfidData.timestamp).toLocaleString()}
                  </p>
                )}
                <div className="flex items-center justify-center space-x-2">
                  <MdCheckCircle className="text-green-300 text-xl" />
                  <span className="text-green-200 font-medium">Active</span>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <p className="text-white text-lg">No RFID detected</p>
                <p className="text-brand-beige/70 text-sm mt-2">
                  Make sure ESP8266 is connected and scanning
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={copyToClipboard}
            disabled={!rfidData?.uid || !rfidData?.isActive}
            className="flex-1 flex items-center justify-center space-x-2 bg-brand-orange text-white px-6 py-4 rounded-xl hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-orange/30"
          >
            <MdContentCopy className="text-xl" />
            <span>{copied ? 'Copied!' : 'Copy UID'}</span>
          </button>
          <button
            onClick={fetchRfid}
            className="flex-1 flex items-center justify-center space-x-2 bg-brand-charcoal text-white px-6 py-4 rounded-xl hover:bg-brand-dark transition-colors shadow-lg"
          >
            <MdRefresh className="text-xl" />
            <span>Refresh</span>
          </button>
          <button
            onClick={clearRfid}
            disabled={!rfidData?.uid}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-4 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <MdCancel className="text-xl" />
            <span>Clear</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-brand-beige border border-brand-orange/30 rounded-2xl p-6">
          <h3 className="font-semibold text-brand-dark mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-brand-charcoal text-sm">
            <li>Ensure your ESP8266 device is connected and sending RFID data to the endpoint</li>
            <li>ESP8266 should POST to: <code className="bg-white px-2 py-1 rounded border border-brand-orange/20">/api/rfid/update</code></li>
            <li>When a card is scanned, the UID will appear here automatically</li>
            <li>Click "Copy UID" to copy it for use in pending registrations</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RFIDViewer;

