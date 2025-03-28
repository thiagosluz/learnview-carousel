
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Professor } from '@/types';

interface ProfessorTableProps {
  professors: Professor[];
  onDeleteClick: (professor: Professor) => void;
  onConfirmDelete: () => void;
  professorToDelete: Professor | null;
  onCancelDelete: () => void;
}

export const ProfessorTable = ({
  professors,
  onDeleteClick,
  onConfirmDelete,
  professorToDelete,
  onCancelDelete
}: ProfessorTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professors.map((professor) => (
            <TableRow key={professor.id}>
              <TableCell className="flex items-center gap-2">
                {professor.photo_url ? (
                  <img 
                    src={professor.photo_url} 
                    alt={professor.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {professor.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {professor.name}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link to={`/professors/edit/${professor.id}`}>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onDeleteClick(professor)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o professor {professorToDelete?.name}? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancelDelete}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirmDelete}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
