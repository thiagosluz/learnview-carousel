
import { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Class } from '@/types';

interface ClassScheduleProps {
  classes: Class[];
  date: string;
}

const ClassSchedule = ({ classes, date }: ClassScheduleProps) => {
  const [currentClass, setCurrentClass] = useState<number | null>(null);

  useEffect(() => {
    const getCurrentClass = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      const currentIndex = classes.findIndex((classItem) => {
        return currentTime >= classItem.start_time && currentTime <= classItem.end_time;
      });

      setCurrentClass(currentIndex);
    };

    getCurrentClass();
    const interval = setInterval(getCurrentClass, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [classes]);

  // Split classes into two columns
  const midPoint = Math.ceil(classes.length / 2);
  const leftColumnClasses = classes.slice(0, midPoint);
  const rightColumnClasses = classes.slice(midPoint);

  if (classes.length === 0) {
    return (
      <div className="w-full h-full p-8 bg-gradient-to-br from-primary/5 to-secondary rounded-2xl shadow-lg flex items-center justify-center">
        <p className="text-xl text-gray-500">Nenhuma aula programada para hoje</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 lg:p-8 bg-gradient-to-br from-primary/5 to-secondary rounded-2xl shadow-lg animate-fade-in overflow-hidden flex flex-col">
      <div className="mb-4 lg:mb-8">
        <h2 className="text-2xl lg:text-4xl font-display font-bold text-gray-900">Horários de Hoje</h2>
        <p className="text-lg lg:text-xl text-gray-600 capitalize mt-2">{date}</p>
      </div>
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
          {/* Left Column */}
          <div className="space-y-4">
            {leftColumnClasses.map((classItem, index) => (
              <div
                key={classItem.id}
                className={`p-4 lg:p-6 rounded-xl transition-all duration-300 ${
                  currentClass === index
                    ? 'bg-primary text-white scale-[1.02] shadow-lg'
                    : 'bg-white hover:bg-secondary/20'
                }`}
              >
                <div className="flex gap-4 lg:gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={classItem.professor.photo_url}
                      alt={classItem.professor.name}
                      className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border-4 shadow-md ${
                        currentClass === index ? 'border-white' : 'border-primary/20'
                      }`}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 text-base lg:text-lg font-semibold mb-2">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      <span className="whitespace-normal">{classItem.start_time} - {classItem.end_time}</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold mb-2 break-words">{classItem.subject}</h3>
                    <div className="flex flex-col gap-2">
                      <p className="text-base lg:text-lg break-words">{classItem.professor.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-normal">{classItem.lab}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            {rightColumnClasses.map((classItem, index) => (
              <div
                key={classItem.id}
                className={`p-4 lg:p-6 rounded-xl transition-all duration-300 ${
                  currentClass === index + midPoint
                    ? 'bg-primary text-white scale-[1.02] shadow-lg'
                    : 'bg-white hover:bg-secondary/20'
                }`}
              >
                <div className="flex gap-4 lg:gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={classItem.professor.photo_url}
                      alt={classItem.professor.name}
                      className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover border-4 shadow-md ${
                        currentClass === index + midPoint ? 'border-white' : 'border-primary/20'
                      }`}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 text-base lg:text-lg font-semibold mb-2">
                      <Clock className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                      <span className="whitespace-normal">{classItem.start_time} - {classItem.end_time}</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-bold mb-2 break-words">{classItem.subject}</h3>
                    <div className="flex flex-col gap-2">
                      <p className="text-base lg:text-lg break-words">{classItem.professor.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-normal">{classItem.lab}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSchedule;
