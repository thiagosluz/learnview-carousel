
import { Trash2 } from 'lucide-react';
import NavMenu from '@/components/NavMenu';
import { NewsListHeader } from '@/components/news/NewsListHeader';
import { NewsTable } from '@/components/news/NewsTable';
import { NewsPagination } from '@/components/news/NewsPagination';
import { NewsStats } from '@/components/news/NewsStats';
import { DeleteSelectedNewsDialog } from '@/components/news/DeleteSelectedNewsDialog';
import { useNewsList } from '@/hooks/useNewsList';

const NewsList = () => {
  const {
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
  } = useNewsList();

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
            <DeleteSelectedNewsDialog 
              selectedCount={selectedNews.size}
              onDelete={handleDeleteSelected}
              isDeleting={isDeleting}
            />
          </div>
          <NewsListHeader />
        </div>
        
        <NewsStats stats={newsStats} />
        
        <div className="bg-white rounded-lg shadow">
          <NewsTable 
            news={currentNews}
            onDelete={handleDelete}
            onDeleteCancel={() => {}}
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
