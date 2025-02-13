
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import NavMenu from '@/components/NavMenu';
import { fetchAllNews, deleteNews } from '@/services';
import { NewsItem } from '@/types';
import { NewsListHeader } from '@/components/news/NewsListHeader';
import { NewsTable } from '@/components/news/NewsTable';
import { NewsPagination } from '@/components/news/NewsPagination';

const ITEMS_PER_PAGE = 10;

const NewsList = () => {
  const { toast } = useToast();
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: news = [], isLoading, refetch } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: fetchAllNews,
    meta: {
      errorMessage: 'Não foi possível carregar a lista de notícias',
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Erro ao carregar notícias",
          description: error.message,
        });
      }
    }
  });

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = news.slice(startIndex, endIndex);

  const handleDelete = async (newsItem: NewsItem) => {
    try {
      await deleteNews(newsItem.id);
      toast({
        title: "Notícia excluída",
        description: "A notícia foi excluída com sucesso.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir notícia",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir a notícia",
      });
    } finally {
      setNewsToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div>
      <NavMenu />
      <div className="container mx-auto py-8">
        <NewsListHeader />
        
        <div className="bg-white rounded-lg shadow">
          <NewsTable 
            news={currentNews}
            onDelete={handleDelete}
            onDeleteCancel={() => setNewsToDelete(null)}
          />
          
          {totalPages > 1 && (
            <NewsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsList;
