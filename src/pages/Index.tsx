
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import ClassSchedule from '@/components/ClassSchedule';
import NewsCarousel from '@/components/NewsCarousel';
import { fetchTodayClasses, fetchActiveNews } from '@/services';
import { Class, NewsItem } from '@/types';

const SHIFT_UPDATE_INTERVAL = 60000; // 1 minuto
const DATA_REFRESH_INTERVAL = 300000; // 5 minutos

const Index = () => {
  const { toast } = useToast();
  const [currentShift, setCurrentShift] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);

  // Função para determinar o turno atual e filtrar as aulas
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

    // Filtrar aulas baseado no turno
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

  // Atualizar o turno e as aulas filtradas quando os dados mudarem
  useEffect(() => {
    if (allClasses.length > 0) {
      determineShiftAndFilterClasses(allClasses);
    }
  }, [allClasses]);

  // Atualizar periodicamente o turno e as aulas filtradas
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

  if (isLoadingClasses || isLoadingNews) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent p-8 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  const getTurnoText = () => {
    switch (currentShift) {
      case 'morning':
        return 'Aulas do Turno da Manhã';
      case 'afternoon':
        return 'Aulas do Turno da Tarde';
      case 'night':
        return 'Aulas do Turno da Noite';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-secondary via-white to-accent p-8">
      {/* Logo flutuante */}
      <div className="fixed bottom-4 right-4 z-50 w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-lg border-4 border-white hover:scale-105 transition-transform">
        <img
          src="https://scontent.frec10-1.fna.fbcdn.net/v/t39.30808-6/469317382_505665579174481_5541984506667947629_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeH3UddZ5zzNq7TXOx8VZN56sgp7lNDTSUayCnuU0NNJRot-UmUaGYetQ3qNEyXverT3158ppEI0cNMFNO6cHk_L&_nc_ohc=43EFwFU8Qf4Q7kNvgGuuacY&_nc_zt=23&_nc_ht=scontent.frec10-1.fna&_nc_gid=An7C7M86beHmfHOGensTgG-&oh=00_AYBZFSmSVMYJzTbp1fGugVKxMMrhcyRcRDz80je_dG8P1w&oe=67B2D234"
          alt="Logo Coordenação"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[2100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
          <div className="lg:h-full flex flex-col">
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
          <div className="lg:h-full flex flex-col">
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
  );
};

export default Index;
