import { supabase } from '../lib/supabase';
import { AttendanceEntry } from '../types/attendance';

export async function recordAttendance(
  lessonId: string,
  studentId: string,
  entry: AttendanceEntry
) {
  console.log('Recording attendance:', { lessonId, studentId, entry });
  
  const { data, error } = await supabase
    .from('attendance')
    .insert({
      lesson_id: lessonId,
      student_id: studentId,
      join_time: entry.joinTime,
      leave_time: entry.leaveTime || null,
      status: 'joined'
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error recording attendance:', error);
    throw error;
  }

  return data;
}

export async function updateAttendance(
  lessonId: string,
  studentId: string,
  entry: Partial<AttendanceEntry>
) {
  console.log('Updating attendance:', { lessonId, studentId, entry });

  const { data, error } = await supabase
    .from('attendance')
    .update({
      leave_time: entry.leaveTime,
      status: 'completed'
    })
    .eq('lesson_id', lessonId)
    .eq('student_id', studentId)
    .eq('status', 'joined')
    .select('*')
    .single();

  if (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }

  return data;
}

export async function getAttendance(lessonId: string) {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      student:profiles(*)
    `)
    .eq('lesson_id', lessonId);

  if (error) throw error;
  return data;
}