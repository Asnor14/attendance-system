// In-memory storage for live RFID UID from ESP8266
// In production, you might want to use Redis or a proper message queue
let liveRfidUid = null;
let lastUpdateTime = null;

export const updateRfidUid = async (req, res, next) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'RFID UID is required' });
    }

    liveRfidUid = uid;
    lastUpdateTime = new Date().toISOString();

    res.json({
      message: 'RFID UID updated successfully',
      uid: liveRfidUid,
      timestamp: lastUpdateTime
    });
  } catch (error) {
    next(error);
  }
};

export const getLiveRfidUid = async (req, res, next) => {
  try {
    res.json({
      uid: liveRfidUid,
      timestamp: lastUpdateTime,
      isActive: liveRfidUid !== null && lastUpdateTime && 
                (Date.now() - new Date(lastUpdateTime).getTime()) < 30000 // Active if updated within 30 seconds
    });
  } catch (error) {
    next(error);
  }
};

export const clearRfidUid = async (req, res, next) => {
  try {
    liveRfidUid = null;
    lastUpdateTime = null;
    res.json({ message: 'RFID UID cleared' });
  } catch (error) {
    next(error);
  }
};

