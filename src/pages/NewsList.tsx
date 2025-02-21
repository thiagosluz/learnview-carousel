import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import NavMenu from '@/components/NavMenu';
import { fetchAllNews, deleteNews } from '@/services';
import { NewsItem } from '@/types';
import { NewsListHeader } from '@/components/news/NewsListHeader';
import { NewsTable } from '@/components/news/NewsTable';
import { NewsPagination } from '@/components/news/NewsPagination';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 10;

const NewsList = () => {
  const { toast } = useToast();
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      const deletePromises = Array.from(selectedNews).map(id => deleteNews(id));
      await Promise.all(deletePromises);
      toast({
        title: "Notícias excluídas",
        description: `${selectedNews.size} notícias foram excluídas com sucesso.`,
      });
      setSelectedNews(new Set());
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir notícias",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir as notícias",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleNewsSelection = (newsId: string) => {
    const newSelected = new Set(selectedNews);
    if (newSelected.has(newsId)) {
      newSelected.delete(newsId);
    } else {
      newSelected.add(newsId);
    }
    setSelectedNews(newSelected);
  };

  const toggleAllCurrentPage = () => {
    const newSelected = new Set(selectedNews);
    const allSelected = currentNews.every(n => selectedNews.has(n.id));
    
    if (allSelected) {
      currentNews.forEach(n => newSelected.delete(n.id));
    } else {
      currentNews.forEach(n => newSelected.add(n.id));
    }
    
    setSelectedNews(newSelected);
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
        <div className="flex justify-between items-center mb-6">
          {selectedNews.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir selecionadas ({selectedNews.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir {selectedNews.size} notícias? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSelected}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <NewsListHeader />
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <NewsTable 
            news={currentNews}
            onDelete={handleDelete}
            onDeleteCancel={() => setNewsToDelete(null)}
            selectedNews={selectedNews}
            onToggleSelection={toggleNewsSelection}
            onToggleAll={toggleAllCurrentPage}
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
