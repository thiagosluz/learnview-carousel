
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Class } from '@/types';
import ClassCard from './ClassCard';

interface ClassCarouselProps {
  classGroups: Class[][];
  currentClasses: number[];
}

const ClassCarousel = ({ classGroups, currentClasses }: ClassCarouselProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: false,
    containScroll: "trimSnaps",
    duration: 30,
    loop: true
  });

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Atualizar o índice do slide atual quando ele mudar
  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setCurrentSlideIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    onSelect(); // Chamada inicial para definir o valor correto
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    // Auto-scroll a cada 7 segundos se houver mais de um grupo
    if (classGroups.length > 1 && emblaApi) {
      const interval = setInterval(scrollNext, 7000);
      return () => clearInterval(interval);
    }
  }, [emblaApi, classGroups.length, scrollNext]);

  return (
    <>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {classGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex-[0_0_100%] min-w-0">
              <div className="grid grid-cols-1 auto-rows-min gap-2 mx-[8px]">
                {group.map((classItem, index) => {
                  const originalIndex = groupIndex * 3 + index;
                  const isActive = currentClasses.includes(originalIndex);
                  
                  return (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      isActive={isActive}
                      originalIndex={originalIndex}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {classGroups.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {classGroups.map((_, index) => (
            <div 
              key={index} 
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                index === currentSlideIndex ? 'bg-primary' : 'bg-primary/30'
              }`} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ClassCarousel;
