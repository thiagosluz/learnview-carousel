
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

const Index = () => {
  const { toast } = useToast();

  const { 
    data: classes = [], 
    isLoading: isLoadingClasses,
    error: classesError
  } = useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: fetchTodayClasses,
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
    error: newsError
  } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchActiveNews,
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

  if (isLoadingClasses || isLoadingNews) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent p-8 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-accent p-8">
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
                classes={classes || []}
                date={format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
