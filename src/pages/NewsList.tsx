
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trash2, BarChart3 } from 'lucide-react';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ITEMS_PER_PAGE = 10;

const NewsList = () => {
  const { toast } = useToast();
  const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [newsStats, setNewsStats] = useState({
    active: 0,
    inactive: 0,
    expired: 0,
    scheduled: 0,
    displaying: 0
  });

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

  useEffect(() => {
    if (news.length > 0) {
      const now = new Date().toISOString();
      const stats = news.reduce((acc, item) => {
        // Verificar se está ativa/inativa
        if (item.active) {
          acc.active++;
        } else {
          acc.inactive++;
        }

        // Verificar se está expirada
        if (item.publish_end && item.publish_end < now) {
          acc.expired++;
        }

        // Verificar se está agendada (data de início no futuro)
        if (item.publish_start > now) {
          acc.scheduled++;
        }

        // Verificar se está sendo exibida na página inicial
        // Notícia sendo exibida = ativa + dentro do período de publicação (já começou e não expirou)
        if (item.active && 
            item.publish_start <= now && 
            (!item.publish_end || item.publish_end > now)) {
          acc.displaying++;
        }

        return acc;
      }, { active: 0, inactive: 0, expired: 0, scheduled: 0, displaying: 0 });

      setNewsStats(stats);
    }
  }, [news]);

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
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Notícias</h1>
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
          </div>
          <NewsListHeader />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Exibindo Agora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsStats.displaying}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Notícias Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsStats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Notícias Inativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsStats.inactive}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Notícias Expiradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsStats.expired}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Notícias Agendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newsStats.scheduled}</div>
            </CardContent>
          </Card>
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
