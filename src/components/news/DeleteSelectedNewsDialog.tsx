
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
import { Trash2 } from "lucide-react";

interface DeleteSelectedNewsDialogProps {
  selectedCount: number;
  onDelete: () => void;
  isDeleting: boolean;
}

export const DeleteSelectedNewsDialog = ({ 
  selectedCount, 
  onDelete, 
  isDeleting 
}: DeleteSelectedNewsDialogProps) => {
  if (selectedCount === 0) return null;
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isDeleting}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir selecionadas ({selectedCount})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir {selectedCount} notícias? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
