
export interface Professor {
  id: string;
  name: string;
  photo_url: string;
}

export interface Class {
  id: string;
  start_time: string;
  end_time: string;
  professor: Professor;
  subject: string;
  lab: string;
  day_of_week: number;
}

export interface NewsItem {
  id: string;
  type: 'text' | 'image';
  title: string;
  content: string;
  duration: number;
}
