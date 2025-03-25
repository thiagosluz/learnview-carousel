import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createNews, updateNews, fetchNews } from '@/services';
import { NewsFormHeader } from '@/components/news/NewsFormHeader';
import { ImageUploadField } from '@/components/news/ImageUploadField';
import { NewsTypeField } from '@/components/news/NewsTypeField';
import { formSchema, FormData } from '@/components/news/NewsFormTypes';
import { processImage } from '@/lib/imageProcessing';

const NewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'text',
      content: '',
      duration: 10,
      active: true,
      publish_start: new Date().toISOString().split('T')[0],
      publish_end: null,
    },
  });

  useEffect(() => {
    if (id) {
      const loadNews = async () => {
        try {
          const news = await fetchNews(id);
          form.reset({
            title: news.title,
            type: news.type,
            content: news.content,
            duration: news.duration,
            active: news.active ?? true,
            publish_start: news.publish_start.split('T')[0],
            publish_end: news.publish_end ? news.publish_end.split('T')[0] : null,
          });
          if (news.type === 'image') {
            setPreviewUrl(news.content);
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar notícia",
            description: error instanceof Error ? error.message : "Ocorreu um erro ao carregar os dados da notícia",
          });
          navigate('/news');
        }
      };
      loadNews();
    }
  }, [id, form, navigate, toast]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const processedFile = await processImage(file);
        
        setSelectedImage(processedFile);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
          form.setValue('content', file.name);
        };
        reader.readAsDataURL(processedFile);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        toast({
          variant: "destructive",
          title: "Erro ao processar imagem",
          description: "Não foi possível processar a imagem selecionada.",
        });
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const publishStart = new Date(data.publish_start).toISOString();
      const publishEnd = data.publish_end ? new Date(data.publish_end).toISOString() : null;

      if (id) {
        await updateNews(id, {
          title: data.title,
          type: data.type,
          content: data.content,
          duration: data.duration,
          active: data.active,
          image: selectedImage ?? undefined,
          publish_start: publishStart,
          publish_end: publishEnd,
        });
        toast({
          title: "Notícia atualizada",
          description: "A notícia foi atualizada com sucesso.",
        });
      } else {
        await createNews({
          title: data.title,
          type: data.type,
          content: data.content,
          duration: data.duration,
          active: data.active,
          image: selectedImage ?? undefined,
          publish_start: publishStart,
          publish_end: publishEnd,
        });
        toast({
          title: "Notícia cadastrada",
          description: "A notícia foi cadastrada com sucesso.",
        });
      }
      navigate('/news');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar notícia",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar os dados da notícia",
      });
    }
  };

  const isLoading = form.formState.isSubmitting;
  const isImageType = form.watch('type') === 'image';

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <NewsFormHeader isEditing={!!id} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da notícia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <NewsTypeField form={form} />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    {isImageType ? (
                      <ImageUploadField
                        previewUrl={previewUrl}
                        onImageChange={handleImageChange}
                        fieldProps={field}
                      />
                    ) : (
                      <Textarea 
                        placeholder="Conteúdo da notícia" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (segundos)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publish_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de início da publicação</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="publish_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de fim da publicação (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value || null;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Ativo
                    </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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

export default NewsForm;
