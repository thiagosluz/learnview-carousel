
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { fetchAllNews, deleteNews } from '@/services';
import { NewsItem } from '@/types';

const ITEMS_PER_PAGE = 10;

export const useNewsList = () => {
  const { toast } = useToast();
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
        if (item.active) {
          acc.active++;
        } else {
          acc.inactive++;
        }

        if (item.publish_end && item.publish_end < now) {
          acc.expired++;
        }

        if (item.publish_start > now) {
          acc.scheduled++;
        }

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

  return {
    news,
    currentNews,
    isLoading,
    currentPage,
    totalPages,
    selectedNews,
    isDeleting,
    newsStats,
    handleDelete,
    handleDeleteSelected,
    toggleNewsSelection,
    toggleAllCurrentPage,
    setCurrentPage
  };
};
