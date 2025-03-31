import { Class } from '@/types';
import { useClassGroups } from '@/hooks/useClassGroups';
import ClassCarousel from '@/components/ClassCarousel';
import { Button } from '@/components/ui/button';

interface ClassScheduleProps {
  classes: Class[];
  date: string;
}

const ClassSchedule = ({ classes, date }: ClassScheduleProps) => {
  const { classGroups, currentClasses } = useClassGroups(classes);
  
  // Extrair o período do texto da data (última parte após o hífen)
  const period = date.split('-').pop()?.trim() || '';

  const ViewAllButton = () => (
    <a href="/horarios">
      <Button
        variant="outline"
        size="sm"
        className="text-primary hover:text-primary/80"
      >
        <span>Horário Completo</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>
    </a>
  );

  if (classes.length === 0) {
    return (
      <div className="w-full h-full p-8 bg-linear-to-br from-primary/5 to-secondary rounded-2xl shadow-lg flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-500">
          Nenhuma aula programada para o {period.toLowerCase()}
        </p>
        <ViewAllButton />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 lg:p-4 bg-linear-to-br from-primary/5 to-secondary rounded-2xl shadow-lg animate-fade-in">
      <div className="mb-2 lg:mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl lg:text-2xl font-display font-bold text-gray-900">Horários de Hoje</h2>
          <p className="text-sm lg:text-base text-gray-600 capitalize">{date}</p>
        </div>
        <ViewAllButton />
      </div>
      
      <ClassCarousel 
        classGroups={classGroups} 
        currentClasses={currentClasses} 
      />
    </div>
  );
};

export default ClassSchedule;
