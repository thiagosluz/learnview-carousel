
import { useEffect, useState } from 'react';
import { Class } from '@/types';

export const useClassGroups = (classes: Class[]) => {
  const [classGroups, setClassGroups] = useState<Class[][]>([]);
  const [currentClasses, setCurrentClasses] = useState<number[]>([]);

  // Group classes into arrays of 3
  useEffect(() => {
    const groups = classes.reduce((groups: Class[][], item, index) => {
      const groupIndex = Math.floor(index / 3);
      if (!groups[groupIndex]) {
        groups[groupIndex] = [];
      }
      groups[groupIndex].push(item);
      return groups;
    }, []);
    
    setClassGroups(groups);
  }, [classes]);

  // Track current active classes
  useEffect(() => {
    const getCurrentClasses = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentIndexes = classes.map((classItem, index) => ({
        index,
        item: classItem
      })).filter(({
        item
      }) => currentTime >= item.start_time && currentTime <= item.end_time).map(({
        index
      }) => index);
      setCurrentClasses(currentIndexes);
    };
    getCurrentClasses();
    const interval = setInterval(getCurrentClasses, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [classes]);

  return { classGroups, currentClasses };
};
