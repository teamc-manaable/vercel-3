import { AttendanceEntry } from '../types/attendance';

export function calculateAttendancePercentage(
  entries: AttendanceEntry[],
  duration: string
): number {
  // Convert duration string to minutes
  const durationInMinutes = parseDuration(duration);
  
  // Calculate total attended minutes
  const totalAttendedMinutes = entries.reduce((total, entry) => {
    const joinTime = parseTimeToMinutes(entry.joinTime);
    const leaveTime = parseTimeToMinutes(entry.leaveTime);
    return total + (leaveTime - joinTime);
  }, 0);

  // Calculate percentage
  return Math.round((totalAttendedMinutes / durationInMinutes) * 100);
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+(?:\.\d+)?)\s*(hour|hours)/);
  if (!match) return 0;
  return parseFloat(match[1]) * 60;
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}