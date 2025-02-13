
import { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Class } from '@/types';

interface ClassScheduleProps {
  classes: Class[];
  date: string;
}

const ClassSchedule = ({ classes, date }: ClassScheduleProps) => {
  const [currentClasses, setCurrentClasses] = useState<number[]>([]);

  useEffect(() => {
    const getCurrentClasses = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const currentIndexes = classes
        .map((classItem, index) => ({index, item: classItem}))
        .filter(({item}) => currentTime >= item.start_time && currentTime <= item.end_time)
        .map(({index}) => index);

      setCurrentClasses(currentIndexes);
    };

    getCurrentClasses();
    const interval = setInterval(getCurrentClasses, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [classes]);

  if (classes.length === 0) {
    return (
      <div className="w-full h-full p-8 bg-gradient-to-br from-primary/5 to-secondary rounded-2xl shadow-lg flex items-center justify-center">
        <p className="text-xl text-gray-500">Nenhuma aula programada para hoje</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-3 lg:p-6 bg-gradient-to-br from-primary/5 to-secondary rounded-2xl shadow-lg animate-fade-in">
      <div className="mb-3 lg:mb-6">
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">Horários de Hoje</h2>
        <p className="text-base lg:text-lg text-gray-600 capitalize mt-1">{date}</p>
      </div>
      <div className="grid grid-cols-1 auto-rows-min gap-3">
        {classes.map((classItem, index) => (
          <div
            key={classItem.id}
            className={`p-3 lg:p-4 rounded-xl transition-all duration-300 ${
              currentClasses.includes(index)
                ? 'bg-primary text-white scale-[1.02] shadow-lg'
                : 'bg-white hover:bg-secondary/20'
            }`}
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="flex-shrink-0">
                <img
                  src={classItem.professor.photo_url}
                  alt={classItem.professor.name}
                  className={`w-14 h-14 rounded-full object-cover border-2 shadow-md ${
                    currentClasses.includes(index) ? 'border-white' : 'border-primary/20'
                  }`}
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 text-sm lg:text-base font-semibold">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{classItem.start_time} - {classItem.end_time}</span>
                </div>
                <h3 className="text-base lg:text-lg font-bold mt-1 break-words">{classItem.subject}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm break-words">{classItem.professor.name}</span>
                  <div className={`flex items-center gap-1 ml-2 px-2 py-0.5 rounded-lg ${
                    currentClasses.includes(index)
                      ? 'bg-white/20 text-white'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{classItem.lab}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
