
import { Clock, MapPin, BookOpen } from 'lucide-react';
import { Class } from '@/types';
import { getClassHighlightColor } from '@/utils/courseColors';

interface ClassCardProps {
  classItem: Class;
  isActive: boolean;
  originalIndex: number;
}

const ClassCard = ({ classItem, isActive, originalIndex }: ClassCardProps) => {
  const highlightColor = getClassHighlightColor(classItem.course);
  
  return (
    <div className={`${isActive ? 'p-0.5' : ''}`}>
      <div className={`p-2 lg:p-3 rounded-xl transition-all duration-300 ${isActive ? `${highlightColor} scale-[1.02] shadow-lg` : 'bg-white hover:bg-secondary/20'}`}>
        <div className="flex items-center gap-3 lg:gap-4 mx-0">
          <div className="shrink-0">
            <img 
              src={classItem.professor.photo_url} 
              alt={classItem.professor.name} 
              className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 shadow-md ${isActive ? 'border-white' : 'border-primary/20'}`} 
            />
          </div>
          <div className="grow min-w-0">
            <div className="flex items-center gap-1.5 text-xs lg:text-sm font-semibold">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>{classItem.course}</span>
            </div>
            <h3 className="text-sm lg:text-base font-bold mt-0.5 break-words">{classItem.subject}</h3>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs lg:text-sm break-words">{classItem.professor.name}</span>
              <div className={`flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs lg:text-sm font-medium">{classItem.start_time} - {classItem.end_time}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs lg:text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{classItem.lab}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
