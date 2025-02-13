
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import NavMenu from '@/components/NavMenu';
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
import { fetchLinks, deleteLink } from '@/services/links';
import type { Link as LinkType } from '@/services/links';

const LinkList = () => {
  const { toast } = useToast();
  const [linkToDelete, setLinkToDelete] = useState<LinkType | null>(null);

  const { data: links = [], isLoading, refetch } = useQuery({
    queryKey: ['links'],
    queryFn: fetchLinks,
  });

  const handleDelete = async () => {
    if (!linkToDelete) return;

    try {
      await deleteLink(linkToDelete.id);
      toast({
        title: "Link excluído",
        description: "O link foi excluído com sucesso.",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir link",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir o link",
      });
    } finally {
      setLinkToDelete(null);
    }
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
          <h1 className="text-2xl font-bold">Links QR Code</h1>
          <Link to="/links/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Link
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.name}</TableCell>
                  <TableCell className="max-w-md truncate">{link.url}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/links/edit/${link.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setLinkToDelete(link)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o link {link.name}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setLinkToDelete(null)}>
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
        </div>
      </div>
    </div>
  );
};

export default LinkList;
