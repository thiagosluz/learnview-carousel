
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Class, NewsItem } from '@/types';
import ClassSchedule from '@/components/ClassSchedule';
import NewsCarousel from '@/components/NewsCarousel';
import CoordinationInfo from '@/components/CoordinationInfo';
import ErrorAlert from '@/components/ErrorAlert';

interface DesktopIndexViewProps {
  classes: Class[];
  news: NewsItem[];
  classesError: Error | null;
  newsError: Error | null;
  shiftText: string;
}

const DesktopIndexView = ({ 
  classes, 
  news, 
  classesError, 
  newsError,
  shiftText
}: DesktopIndexViewProps) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-secondary via-white to-accent p-8">
      <div className="max-w-[2100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
          <div className="lg:h-full">
            {newsError ? (
              <ErrorAlert 
                title="Erro" 
                description="Não foi possível carregar as notícias. Por favor, tente novamente mais tarde." 
              />
            ) : (
              <NewsCarousel items={news || []} />
            )}
          </div>
          <div className="lg:h-full flex flex-col gap-4">
            <CoordinationInfo />
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
    </div>
  );
};

export default DesktopIndexView;
