
import { useEffect } from 'react';
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
import { createLink, updateLink, fetchLink } from '@/services/links';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  url: z.string().url('URL inválida').min(1, 'URL é obrigatória'),
});

type FormData = z.infer<typeof formSchema>;

const LinkForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
    },
  });

  useEffect(() => {
    if (id) {
      const loadLink = async () => {
        try {
          const link = await fetchLink(id);
          form.reset({
            name: link.name,
            url: link.url,
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar link",
            description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados do link",
          });
          navigate('/links');
        }
      };
      loadLink();
    }
  }, [id, form, navigate, toast]);

  const onSubmit = async (data: FormData) => {
    try {
      if (id) {
        await updateLink(id, {
          name: data.name,
          url: data.url,
        });
        toast({
          title: "Link atualizado",
          description: "O link foi atualizado com sucesso.",
        });
      } else {
        await createLink({
          name: data.name,
          url: data.url,
        });
        toast({
          title: "Link cadastrado",
          description: "O link foi cadastrado com sucesso.",
        });
      }
      navigate('/links');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar link",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar os dados do link",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/links">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {id ? 'Editar Link' : 'Novo Link'}
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
                    <Input placeholder="Nome do link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LinkForm;
