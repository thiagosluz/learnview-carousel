
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Pencil } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { NewsItem } from '@/types';
import { DeleteNewsDialog } from './DeleteNewsDialog';

interface NewsTableRowProps {
  news: NewsItem;
  onDelete: () => Promise<void>;
  onDeleteCancel: () => void;
  isSelected: boolean;
  onToggleSelection: () => void;
}

export const NewsTableRow = ({ 
  news, 
  onDelete, 
  onDeleteCancel, 
  isSelected,
  onToggleSelection 
}: NewsTableRowProps) => {
  const getPublicationStatus = (news: NewsItem) => {
    const now = new Date();
    const publishStart = new Date(news.publish_start);
    const publishEnd = news.publish_end ? new Date(news.publish_end) : null;

    if (!news.active) {
      return { status: 'Inativa', className: 'bg-gray-100 text-gray-800' };
    }

    if (now < publishStart) {
      return { status: 'Agendada', className: 'bg-yellow-100 text-yellow-800' };
    }

    if (publishEnd && now > publishEnd) {
      return { status: 'Expirada', className: 'bg-red-100 text-red-800' };
    }

    return { status: 'Ativa', className: 'bg-green-100 text-green-800' };
  };

  const { status, className } = getPublicationStatus(news);

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelection}
        />
      </TableCell>
      <TableCell>{news.title}</TableCell>
      <TableCell>
        {news.type === 'text' ? 'Texto' : 'Imagem'}
      </TableCell>
      <TableCell>{news.duration}</TableCell>
      <TableCell>
        {format(new Date(news.publish_start), 'dd/MM/yyyy', { locale: ptBR })}
      </TableCell>
      <TableCell>
        {news.publish_end 
          ? format(new Date(news.publish_end), 'dd/MM/yyyy', { locale: ptBR })
          : 'Sem data fim'}
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
          {status}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Link to={`/news/edit/${news.id}`}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteNewsDialog 
            news={news}
            onDelete={onDelete}
            onCancel={onDeleteCancel}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
