
import { useEffect, useState, useCallback } from 'react';
import { Clock, MapPin } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { Class } from '@/types';

interface ClassScheduleProps {
  classes: Class[];
  date: string;
}

const ClassSchedule = ({ classes, date }: ClassScheduleProps) => {
  const [currentClasses, setCurrentClasses] = useState<number[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: false,
    containScroll: "trimSnaps",
    duration: 30,
    loop: true
  });

  // Dividir as aulas em grupos de 3
  const classGroups = classes.reduce((groups: Class[][], item, index) => {
    const groupIndex = Math.floor(index / 3);
    if (!groups[groupIndex]) {
      groups[groupIndex] = [];
    }
    groups[groupIndex].push(item);
    return groups;
  }, []);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  useEffect(() => {
    // Auto-scroll a cada 5 segundos se houver mais de um grupo
    if (classGroups.length > 1 && emblaApi) {
      const interval = setInterval(scrollNext, 5000);
      return () => clearInterval(interval);
    }
  }, [emblaApi, classGroups.length, scrollNext]);

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
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {classGroups.map((group, groupIndex) => (
            <div 
              key={groupIndex}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="grid grid-cols-1 auto-rows-min gap-3">
                {group.map((classItem, index) => {
                  const originalIndex = groupIndex * 3 + index;
                  return (
                    <div
                      key={classItem.id}
                      className="p-1.5" // Adicionado padding externo para evitar corte
                    >
                      <div
                        className={`p-2.5 lg:p-3.5 rounded-xl transition-all duration-300 ${
                          currentClasses.includes(originalIndex)
                            ? 'bg-primary text-white scale-[1.02] shadow-lg'
                            : 'bg-white hover:bg-secondary/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <img
                              src={classItem.professor.photo_url}
                              alt={classItem.professor.name}
                              className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-2 shadow-md ${
                                currentClasses.includes(originalIndex) ? 'border-white' : 'border-primary/20'
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
                                currentClasses.includes(originalIndex)
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {classGroups.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {classGroups.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === 0 ? 'bg-primary' : 'bg-primary/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;
