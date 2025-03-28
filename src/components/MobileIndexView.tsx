
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Class, NewsItem } from '@/types';
import ClassSchedule from '@/components/ClassSchedule';
import NewsCarousel from '@/components/NewsCarousel';
import CoordinationInfo from '@/components/CoordinationInfo';
import ErrorAlert from '@/components/ErrorAlert';

interface MobileIndexViewProps {
  classes: Class[];
  news: NewsItem[];
  classesError: Error | null;
  newsError: Error | null;
  shiftText: string;
}

const MobileIndexView = ({ 
  classes, 
  news, 
  classesError, 
  newsError,
  shiftText
}: MobileIndexViewProps) => {
  return (
    <div className="relative min-h-screen bg-linear-to-br from-secondary via-white to-accent p-4">
      <div className="max-w-[2100px] mx-auto">
        <div className="flex flex-col gap-4">
          <CoordinationInfo />
          
          <div className="w-full h-[50vh]">
            {newsError ? (
              <ErrorAlert 
                title="Erro" 
                description="Não foi possível carregar as notícias. Por favor, tente novamente mais tarde." 
              />
            ) : (
              <NewsCarousel items={news || []} />
            )}
          </div>
          
          {classesError ? (
            <ErrorAlert 
              title="Erro" 
              description="Não foi possível carregar os horários. Por favor, tente novamente mais tarde." 
            />
          ) : (
            <ClassSchedule 
              classes={classes}
              date={`${format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })} - ${shiftText}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileIndexView;
