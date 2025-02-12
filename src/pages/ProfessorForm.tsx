import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createProfessor, updateProfessor, fetchProfessor } from '@/services';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  photo: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

const ProfessorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (id) {
      const loadProfessor = async () => {
        try {
          const professor = await fetchProfessor(id);
          form.reset({
            name: professor.name,
          });
          setPreviewUrl(professor.photo_url);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar professor",
            description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do professor",
          });
          navigate('/professors');
        }
      };
      loadProfessor();
    }
  }, [id, form, navigate, toast]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (id) {
        await updateProfessor(id, {
          name: data.name,
          photo: data.photo,
        });
        toast({
          title: "Professor atualizado",
          description: "Os dados do professor foram atualizados com sucesso.",
        });
      } else {
        await createProfessor({
          name: data.name,
          photo: data.photo,
        });
        toast({
          title: "Professor cadastrado",
          description: "O professor foi cadastrado com sucesso.",
        });
      }
      navigate('/professors');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar professor",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar os dados do professor",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/professors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {id ? 'Editar Professor' : 'Novo Professor'}
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do professor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Foto</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfessorForm;
