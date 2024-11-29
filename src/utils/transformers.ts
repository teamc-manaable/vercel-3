import { Training } from '../types/training';

export function transformTrainingData(training: any): Training {
  return {
    id: training.id,
    title: training.title,
    description: training.description,
    startDate: training.start_date,
    duration: training.duration,
    maxStudents: training.max_students,
    enrolledStudents: training.enrollments?.map((enrollment: any) => ({
      id: enrollment.profiles.id,
      email: enrollment.profiles.email,
      name: enrollment.profiles.full_name,
      department: enrollment.profiles.department,
      avatar: enrollment.profiles.avatar_url,
      enrollmentDate: enrollment.enrollment_date,
      attendance: 0
    })) || [],
    lessons: training.lessons?.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      date: lesson.date,
      startTime: lesson.start_time,
      duration: lesson.duration,
      zoomLink: lesson.zoom_link,
      completionThreshold: lesson.completion_threshold,
      attendance: lesson.attendance ? {
        lessonId: lesson.id,
        completionThreshold: lesson.completion_threshold,
        studentAttendance: lesson.attendance.map((record: any) => ({
          studentId: record.student_id,
          entries: [{
            joinTime: new Date(record.join_time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            leaveTime: new Date(record.leave_time).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }],
          attendancePercentage: 0,
          status: 'Completed'
        }))
      } : undefined
    })) || []
  };
}