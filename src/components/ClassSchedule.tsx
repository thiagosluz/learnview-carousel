
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
    // Auto-scroll a cada 7 segundos se houver mais de um grupo
    if (classGroups.length > 1 && emblaApi) {
      const interval = setInterval(scrollNext, 7000);
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
    <div className="w-full h-full p-2 lg:p-4 bg-gradient-to-br from-primary/5 to-secondary rounded-2xl shadow-lg animate-fade-in">
      <div className="mb-2 lg:mb-4">
        <h2 className="text-xl lg:text-2xl font-display font-bold text-gray-900">Horários de Hoje</h2>
        <p className="text-sm lg:text-base text-gray-600 capitalize">{date}</p>
      </div>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {classGroups.map((group, groupIndex) => (
            <div 
              key={groupIndex}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className="grid grid-cols-1 auto-rows-min gap-2">
                {group.map((classItem, index) => {
                  const originalIndex = groupIndex * 3 + index;
                  const isActive = currentClasses.includes(originalIndex);
                  return (
                    <div
                      key={classItem.id}
                      className={`${isActive ? 'scale-[1.02]' : ''} transition-all duration-300`}
                    >
                      <div
                        className={`p-4 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-[#9b87f5] text-white'
                            : 'bg-[#E5DEFF] hover:bg-[#D6BCFA]'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={classItem.professor.photo_url}
                              alt={classItem.professor.name}
                              className={`w-14 h-14 rounded-full object-cover ring-2 ${
                                isActive ? 'ring-white' : 'ring-[#9b87f5]/30'
                              }`}
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-lg font-bold tracking-tight">{classItem.subject}</h3>
                              <div className="flex items-center gap-1.5 text-sm">
                                <Clock className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7E69AB]'}`} />
                                <span className={isActive ? 'text-white' : 'text-[#7E69AB]'}>
                                  {classItem.start_time} - {classItem.end_time}
                                </span>
                              </div>
                            </div>
                            <p className={`text-sm mb-1 ${isActive ? 'text-white/90' : 'text-[#6E59A5]'}`}>
                              {classItem.professor.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-sm">
                              <MapPin className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7E69AB]'}`} />
                              <span className={isActive ? 'text-white' : 'text-[#7E69AB]'}>
                                {classItem.lab}
                              </span>
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
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index === 0 ? 'bg-[#9b87f5]' : 'bg-[#9b87f5]/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;
