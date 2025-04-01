export interface Class {
  id: string;
  subject: string;
  start_time: string;
  end_time: string;
  day_of_week: DayOfWeek;
  professor: Professor;
  lab: Laboratory;
  course: Course;
  period: string;
} 