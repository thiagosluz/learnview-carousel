
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import ClassSchedule from '@/components/ClassSchedule';
import NewsCarousel from '@/components/NewsCarousel';
import CoordinationInfo from '@/components/CoordinationInfo';
import { fetchTodayClasses, fetchActiveNews } from '@/services';
import { Class, NewsItem } from '@/types';

const SHIFT_UPDATE_INTERVAL = 60000; // 1 minuto
const DATA_REFRESH_INTERVAL = 300000; // 5 minutos

const Index = () => {
  const { toast } = useToast();
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

  const { 
    data: allClasses = [], 
    isLoading: isLoadingClasses,
    error: classesError,
  } = useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: fetchTodayClasses,
    refetchInterval: DATA_REFRESH_INTERVAL,
    retry: 2,
    meta: {
      errorMessage: 'Não foi possível carregar os horários das aulas',
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar horários",
          description: error.message,
        });
      }
    }
  });

  const {
    data: news = [],
    isLoading: isLoadingNews,
    error: newsError,
  } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchActiveNews,
    refetchInterval: DATA_REFRESH_INTERVAL,
    retry: 2,
    meta: {
      errorMessage: 'Não foi possível carregar as notícias',
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar notícias",
          description: error.message,
        });
      }
    }
  });

  useEffect(() => {
    if (allClasses.length > 0) {
      determineShiftAndFilterClasses(allClasses);
    }
  }, [allClasses]);

  useEffect(() => {
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

  const getTurnoText = () => {
    switch (currentShift) {
      case 'morning':
        return 'Período Matutino';
      case 'afternoon':
        return 'Período Vespertino';
      case 'night':
        return 'Período Noturno';
    }
  };

  if (isLoadingClasses || isLoadingNews) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent p-8 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent">
      <div className="min-h-screen w-full p-8">
        <div className="max-w-[2100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:h-full">
              {newsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>
                    Não foi possível carregar as notícias. Por favor, tente novamente mais tarde.
                  </AlertDescription>
                </Alert>
              ) : (
                <NewsCarousel items={news || []} />
              )}
            </div>
            <div className="lg:h-full flex flex-col gap-4">
              <CoordinationInfo />
              {classesError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>
                    Não foi possível carregar os horários. Por favor, tente novamente mais tarde.
                  </AlertDescription>
                </Alert>
              ) : (
                <ClassSchedule 
                  classes={filteredClasses}
                  date={`${format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })} - ${getTurnoText()}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
