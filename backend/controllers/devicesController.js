import supabase from '../config/supabaseClient.js';

export const getAllDevices = async (req, res, next) => {
  try {
    const { data: devices, error } = await supabase.from('devices').select('*');
    if (error) throw error;

    // Dynamic Online/Offline Logic
    const now = new Date();
    const updatedDevices = devices.map(device => {
      let status = 'offline';
      if (device.last_sync) {
        const lastSync = new Date(device.last_sync);
        if ((now - lastSync) / 1000 < 60) status = 'online';
      }
      return { ...device, status };
    });

    res.json(updatedDevices);
  } catch (error) { next(error); }
};

export const deviceHeartbeat = async (req, res, next) => {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('devices')
      .update({ last_sync: now, status: 'online' })
      .eq('id', req.params.id);
      
    if (error) throw error;
    res.json({ success: true });
  } catch (error) { next(error); }
};

export const getDeviceLogs = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('kiosk_id', req.params.id)
      .order('id', { ascending: false })
      .limit(1000);

    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

export const getDeviceById = async (req, res, next) => {
  try {
    const { data: device, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Device not found' });

    // Dynamic Status Logic
    const now = new Date();
    let status = 'offline';
    if (device.last_sync) {
      const lastSync = new Date(device.last_sync);
      if ((now - lastSync) / 1000 < 60) status = 'online';
    }

    res.json({ ...device, status });
  } catch (error) { next(error); }
};

export const createDevice = async (req, res, next) => {
  try {
    const { device_name, device_type } = req.body;
    const { data, error } = await supabase
      .from('devices')
      .insert([{ device_name, device_type, status: 'offline' }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

export const deleteDevice = async (req, res, next) => {
  try {
    const { error } = await supabase.from('devices').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) { next(error); }
};

export const registerDevice = async (req, res, next) => {
  try {
    const { device_name, device_type } = req.body;
    
    // Check existing
    const { data: existing } = await supabase
      .from('devices')
      .select('*')
      .eq('device_name', device_name)
      .single();

    if (existing) {
      await supabase
        .from('devices')
        .update({ status: 'online', last_sync: new Date().toISOString() })
        .eq('id', existing.id);
      return res.json({ id: existing.id, message: "Device registered (existing)" });
    }

    // Create new
    const { data, error } = await supabase
      .from('devices')
      .insert([{ device_name, device_type, status: 'online', last_sync: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    res.json({ id: data.id, message: "Device registered (new)" });
  } catch (error) { next(error); }
};