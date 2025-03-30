import { useState, useEffect } from 'react';
import { Class } from '@/types';

export const useShiftManager = (allClasses: Class[]) => {
  const [currentShift, setCurrentShift] = useState<'morning' | 'afternoon' | 'night'>(getCurrentShift());
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  // Função para determinar o período atual baseado na hora
  function getCurrentShift(): 'morning' | 'afternoon' | 'night' {
    const currentTime = new Date().getHours();
    
    if (currentTime >= 0 && currentTime < 12) {
      return 'morning';
    } else if (currentTime >= 12 && currentTime < 18) {
      return 'afternoon';
    } else {
      return 'night';
    }
  }

  // Função para filtrar as aulas do período atual
  const filterClassesByShift = (classes: Class[], shift: 'morning' | 'afternoon' | 'night') => {
    return classes.filter(classItem => {
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
  };

  // Atualiza o período atual a cada minuto
  useEffect(() => {
    const updateShift = () => {
      const newShift = getCurrentShift();
      setCurrentShift(newShift);
      
      if (allClasses.length > 0) {
        const filtered = filterClassesByShift(allClasses, newShift);
        setFilteredClasses(filtered);
      }
    };

    // Atualiza imediatamente
    updateShift();

    // Configura o intervalo para atualizar a cada minuto
    const interval = setInterval(updateShift, 60000);

    return () => clearInterval(interval);
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

