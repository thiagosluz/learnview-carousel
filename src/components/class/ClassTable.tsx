
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Class } from '@/types';
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
import { DIAS_SEMANA } from './ClassListFilters';

interface ClassTableProps {
  classes: Class[];
  selectedClasses: Set<string>;
  toggleClassSelection: (classId: string) => void;
  toggleAllCurrentPage: () => void;
  setClassToDelete: (class_: Class | null) => void;
  handleDelete: () => void;
}

export const ClassTable = ({
  classes,
  selectedClasses,
  toggleClassSelection,
  toggleAllCurrentPage,
  setClassToDelete,
  handleDelete
}: ClassTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={classes.length > 0 && classes.every(c => selectedClasses.has(c.id))}
              onCheckedChange={toggleAllCurrentPage}
            />
          </TableHead>
          <TableHead>Dia</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Professor</TableHead>
          <TableHead>Disciplina</TableHead>
          <TableHead>Laboratório</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((class_) => (
          <TableRow key={class_.id}>
            <TableCell>
              <Checkbox
                checked={selectedClasses.has(class_.id)}
                onCheckedChange={() => toggleClassSelection(class_.id)}
              />
            </TableCell>
            <TableCell>{DIAS_SEMANA[class_.day_of_week]}</TableCell>
            <TableCell>{`${class_.start_time} - ${class_.end_time}`}</TableCell>
            <TableCell>{class_.professor.name}</TableCell>
            <TableCell>{class_.subject}</TableCell>
            <TableCell>{class_.lab}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link to={`/classes/edit/${class_.id}`}>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setClassToDelete(class_)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setClassToDelete(null)}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
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
  );
};
