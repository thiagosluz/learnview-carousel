import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import AdminLayout from '@/components/AdminLayout';
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
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      const deletePromises = Array.from(selectedLinks).map(id => deleteLink(id));
      await Promise.all(deletePromises);
      toast({
        title: "Links excluídos",
        description: `${selectedLinks.size} links foram excluídos com sucesso.`,
      });
      setSelectedLinks(new Set());
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir links",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir os links",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleLinkSelection = (linkId: string) => {
    const newSelected = new Set(selectedLinks);
    if (newSelected.has(linkId)) {
      newSelected.delete(linkId);
    } else {
      newSelected.add(linkId);
    }
    setSelectedLinks(newSelected);
  };

  const toggleAllLinks = () => {
    const newSelected = new Set(selectedLinks);
    const allSelected = links.every(link => selectedLinks.has(link.id));
    
    if (allSelected) {
      links.forEach(link => newSelected.delete(link.id));
    } else {
      links.forEach(link => newSelected.add(link.id));
    }
    
    setSelectedLinks(newSelected);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-gray-600">Carregando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Links QR Code</h1>
            {selectedLinks.size > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir selecionados ({selectedLinks.size})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão em massa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir {selectedLinks.size} links? Esta ação não pode ser desfeita.
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
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={links.length > 0 && links.every(link => selectedLinks.has(link.id))}
                    onCheckedChange={toggleAllLinks}
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedLinks.has(link.id)}
                      onCheckedChange={() => toggleLinkSelection(link.id)}
                    />
                  </TableCell>
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
    </AdminLayout>
  );
};

export default LinkList;
