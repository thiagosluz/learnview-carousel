
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchTodayClasses, fetchActiveNews } from '@/services';
import { Class, NewsItem } from '@/types';
import { useShiftManager } from '@/components/ShiftManager';
import MobileIndexView from '@/components/MobileIndexView';
import DesktopIndexView from '@/components/DesktopIndexView';

const DATA_REFRESH_INTERVAL = 300000; // 5 minutes

const Index = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const { filteredClasses, getShiftText } = useShiftManager(allClasses);

  if (isLoadingClasses || isLoadingNews) {
    return (
      <div className="min-h-screen bg-linear-to-br from-secondary via-white to-accent p-8 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return isMobile ? (
    <MobileIndexView 
      classes={filteredClasses}
      news={news}
      classesError={classesError as Error}
      newsError={newsError as Error}
      shiftText={getShiftText()}
    />
  ) : (
    <DesktopIndexView 
      classes={filteredClasses}
      news={news}
      classesError={classesError as Error}
      newsError={newsError as Error}
      shiftText={getShiftText()}
    />
  );
};

export default Index;
