
import { useState, useEffect } from 'react';
import { Class } from '@/types';

export const useShiftManager = (allClasses: Class[]) => {
  const [currentShift, setCurrentShift] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  const determineShiftAndFilterClasses = (classes: Class[]) => {
    const now = new Date();
    const currentTime = now.getHours();

    let shift: 'morning' | 'afternoon' | 'night';
    if (currentTime >= 0 && currentTime < 12) {
      shift = 'morning';
    } else if (currentTime >= 12 && currentTime < 18) {
      shift = 'afternoon';
    } else {
      shift = 'night';
    }

    const filtered = classes.filter(classItem => {
      const classHour = parseInt(classItem.start_time.split(':')[0]);
      
      switch (shift) {
        case 'morning':
          return classHour >= 6 && classHour < 12;
        case 'afternoon':
          return classHour >= 12 && classHour < 18;
        case 'night':
          return classHour >= 18 || classHour < 6;
      }
    });

    setCurrentShift(shift);
    setFilteredClasses(filtered);
  };

  useEffect(() => {
    if (allClasses.length > 0) {
      determineShiftAndFilterClasses(allClasses);
    }
  }, [allClasses]);

  useEffect(() => {
    const SHIFT_UPDATE_INTERVAL = 60000; // 1 minute
    
    const updateShift = () => {
      if (allClasses.length > 0) {
        determineShiftAndFilterClasses(allClasses);
      }
    };

    const shiftInterval = setInterval(updateShift, SHIFT_UPDATE_INTERVAL);

    return () => {
      clearInterval(shiftInterval);
    };
  }, [allClasses]);

  const getShiftText = () => {
    switch (currentShift) {
      case 'morning':
        return 'Período Matutino';
      case 'afternoon':
        return 'Período Vespertino';
      case 'night':
        return 'Período Noturno';
    }
  };

  return {
    currentShift,
    filteredClasses,
    getShiftText
  };
};

