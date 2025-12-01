import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { devicesAPI } from '../api/devices';
import { schedulesAPI } from '../api/schedules';
import { studentsAPI } from '../api/students';
import { 
  MdArrowBack, MdSync, MdClass, MdAccessTime, MdDateRange, 
  MdCheckCircle, MdWarning, MdCancel, MdPerson, MdError, MdEventBusy 
} from 'react-icons/md';

const DeviceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [device, setDevice] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default to today
  const todayLocal = new Date();
  const offset = todayLocal.getTimezoneOffset() * 60000;
  const localISODate = new Date(todayLocal - offset).toISOString().split('T')[0];

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(localISODate);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [deviceData, schedulesData, logsData, studentsData] = await Promise.all([
        devicesAPI.getById(id),
        schedulesAPI.getAll(),
        devicesAPI.getLogs(id),
        studentsAPI.getAll()
      ]);
      setDevice(deviceData);
      setSchedules(schedulesData);
      setLogs(logsData);
      
      const sortedStudents = studentsData.sort((a, b) => 
        a.full_name.localeCompare(b.full_name)
      );
      setStudents(sortedStudents);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: Validate Day of Week ---
  const isClassScheduledToday = () => {
    if (!selectedSchedule) return false;
    
    // Get Day Name from Selected Date (e.g. "Wed")
    const dateObj = new Date(selectedDate);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", "Tue"...
    
    // Check if day matches schedule days
    const classDays = selectedSchedule.days ? selectedSchedule.days.split(',') : [];
    return classDays.includes(dayName);
  };

  const getAttendanceList = () => {
    if (!selectedSchedule) return [];

    // 🛑 STRICT CHECK: If class is not on this day, return empty
    if (!isClassScheduledToday()) return [];

    const scheduleStart = new Date(`${selectedDate}T${selectedSchedule.time_start}`);
    const scheduleEnd = new Date(`${selectedDate}T${selectedSchedule.time_end}`);
    const lateThreshold = new Date(scheduleStart.getTime() + (selectedSchedule.grace_period * 60000));
    // Allow early scans (60 mins before)
    const earlyAccess = new Date(scheduleStart.getTime() - 60 * 60000);

    return students.map(student => {
      const studentLogs = logs.filter(l => {
        const logTime = new Date(l.timestamp.replace(' ', 'T'));
        return l.student_id === student.student_id && 
               logTime.toISOString().split('T')[0] === selectedDate;
      });

      studentLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const firstLog = studentLogs[0];

      let status = 'Absent';
      let timeIn = '--:--';
      let color = 'bg-red-100 text-red-700';
      let icon = <MdCancel />;

      if (firstLog) {
        const logTime = new Date(firstLog.timestamp.replace(' ', 'T'));
        timeIn = logTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (logTime >= earlyAccess && logTime <= lateThreshold) {
          status = 'Present';
          color = 'bg-green-100 text-green-700';
          icon = <MdCheckCircle />;
        } else if (logTime > lateThreshold && logTime <= scheduleEnd) {
          status = 'Late';
          color = 'bg-yellow-100 text-yellow-700';
          icon = <MdWarning />;
        } else {
          status = 'Invalid Time';
          color = 'bg-gray-100 text-gray-500';
          icon = <MdError />;
        }
      }

      return { ...student, status, timeIn, color, icon };
    });
  };

  if (loading) return <div className="p-10 text-center text-brand-charcoal">Loading...</div>;
  if (!device) return <div className="p-10 text-center text-brand-charcoal">Device not found</div>;

  const attendanceList = getAttendanceList();
  const isScheduled = isClassScheduledToday();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => selectedSchedule ? setSelectedSchedule(null) : navigate('/devices')} 
            className="p-2 hover:bg-brand-beige rounded-full transition-colors border border-brand-beige"
          >
            <MdArrowBack size={24} className="text-brand-dark" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">
              {selectedSchedule ? selectedSchedule.subject_name : device.device_name}
            </h1>
            <div className="flex items-center gap-2 text-sm mt-1">
              {selectedSchedule ? (
                <span className="text-brand-charcoal/70 font-medium">
                  {selectedSchedule.subject_code} • {selectedSchedule.time_start} - {selectedSchedule.time_end}
                </span>
              ) : (
                <>
                  <span className={`w-2 h-2 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="uppercase font-bold text-brand-charcoal/70">{device.status}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {selectedSchedule && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-brand-orange/20 shadow-sm">
            <MdDateRange className="text-brand-charcoal/70" />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="outline-none text-brand-dark font-medium"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: SCHEDULE CARDS */}
      {!selectedSchedule && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <div 
              key={schedule.id}
              onClick={() => setSelectedSchedule(schedule)}
              className="bg-white p-6 rounded-2xl shadow-md border border-brand-orange/30 cursor-pointer hover:shadow-xl hover:border-brand-orange transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-brand-beige rounded-xl text-brand-orange">
                  <MdClass size={32} />
                </div>
                <span className="bg-brand-beige text-brand-charcoal text-xs font-bold px-2 py-1 rounded border border-brand-orange/20">
                  {schedule.subject_code}
                </span>
              </div>
              <h3 className="text-xl font-bold text-brand-dark mt-4">{schedule.subject_name}</h3>
              <div className="flex items-center gap-2 text-brand-charcoal mt-2 text-sm">
                <MdAccessTime />
                <span>{schedule.time_start} - {schedule.time_end}</span>
              </div>
              <div className="mt-4 flex gap-1 flex-wrap">
                {schedule.days ? schedule.days.split(',').map(day => (
                  <span key={day} className="text-xs bg-brand-orange/10 text-brand-orange px-2 py-1 rounded-full border border-brand-orange/30">
                    {day}
                  </span>
                )) : <span className="text-xs text-gray-400">No days set</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: ATTENDANCE TABLE */}
      {selectedSchedule && (
        <div className="bg-white rounded-2xl shadow-lg border border-brand-orange/20 overflow-hidden">
          <div className="p-6 border-b border-brand-beige flex justify-between items-center bg-brand-beige/60">
            <div>
              <h2 className="text-lg font-bold text-brand-dark">Student Attendance List</h2>
              <div className="flex items-center gap-2 text-sm text-brand-charcoal/80">
                <span>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                {!isScheduled && (
                  <span className="text-red-500 font-bold bg-red-50 px-2 rounded text-xs flex items-center gap-1">
                    <MdEventBusy /> No Class Today
                  </span>
                )}
              </div>
            </div>
            <button onClick={fetchData} className="flex items-center gap-2 text-brand-orange hover:text-brand-dark font-semibold">
              <MdSync /> Refresh
            </button>
          </div>
          
          {isScheduled ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-brand-charcoal text-brand-beige text-sm uppercase tracking-wide border-b border-brand-beige">
                  <tr>
                    <th className="px-6 py-4 text-left">Student Name</th>
                    <th className="px-6 py-4 text-left">ID</th>
                    <th className="px-6 py-4 text-left">Time In</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige">
                  {attendanceList.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-beige/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-beige rounded-full text-brand-charcoal">
                            <MdPerson />
                          </div>
                          <span className="font-medium text-brand-dark">{item.full_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-brand-charcoal/70 font-mono text-sm">{item.student_id}</td>
                      <td className="px-6 py-4 font-medium text-brand-charcoal">{item.timeIn}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${item.color}`}>
                          {item.icon} {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-brand-charcoal/60">
              <MdEventBusy size={64} className="mx-auto mb-4 text-brand-charcoal/40" />
              <h3 className="text-xl font-bold text-brand-dark">No Class Scheduled</h3>
              <p>This subject is not scheduled for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceDetails;