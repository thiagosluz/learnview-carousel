
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewsItem } from '@/types';
import { NewsTableRow } from './NewsTableRow';

interface NewsTableProps {
  news: NewsItem[];
  onDelete: (news: NewsItem) => Promise<void>;
  onDeleteCancel: () => void;
}

export const NewsTable = ({ news, onDelete, onDeleteCancel }: NewsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
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
          />
        ))}
      </TableBody>
    </Table>
  );
};
