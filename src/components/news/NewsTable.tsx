
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { NewsItem } from '@/types';
import { NewsTableRow } from './NewsTableRow';

interface NewsTableProps {
  news: NewsItem[];
  onDelete: (news: NewsItem) => Promise<void>;
  onDeleteCancel: () => void;
  selectedNews: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleAll: () => void;
}

export const NewsTable = ({ 
  news, 
  onDelete, 
  onDeleteCancel, 
  selectedNews,
  onToggleSelection,
  onToggleAll
}: NewsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={news.length > 0 && news.every(n => selectedNews.has(n.id))}
              onCheckedChange={onToggleAll}
            />
          </TableHead>
          <TableHead>Título</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Duração (segundos)</TableHead>
          <TableHead>Início</TableHead>
          <TableHead>Fim</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news.map((item) => (
          <NewsTableRow
            key={item.id}
            news={item}
            onDelete={() => onDelete(item)}
            onDeleteCancel={onDeleteCancel}
            isSelected={selectedNews.has(item.id)}
            onToggleSelection={() => onToggleSelection(item.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
};
