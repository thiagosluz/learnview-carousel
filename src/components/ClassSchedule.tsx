
import { Class } from '@/types';
import { useClassGroups } from '@/hooks/useClassGroups';
import ClassCarousel from '@/components/ClassCarousel';

interface ClassScheduleProps {
  classes: Class[];
  date: string;
}

const ClassSchedule = ({ classes, date }: ClassScheduleProps) => {
  const { classGroups, currentClasses } = useClassGroups(classes);

  if (classes.length === 0) {
    return (
      <div className="w-full h-full p-8 bg-gradient-to-br from-primary/5 to-secondary rounded-2xl shadow-lg flex items-center justify-center">
        <p className="text-xl text-gray-500">Nenhuma aula programada para hoje</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 lg:p-4 bg-gradient-to-br from-primary/5 to-secondary rounded-2xl shadow-lg animate-fade-in">
      <div className="mb-2 lg:mb-4">
        <h2 className="text-xl lg:text-2xl font-display font-bold text-gray-900">Horários de Hoje</h2>
        <p className="text-sm lg:text-base text-gray-600 capitalize">{date}</p>
      </div>
      
      <ClassCarousel 
        classGroups={classGroups} 
        currentClasses={currentClasses} 
      />
    </div>
  );
};

export default ClassSchedule;
