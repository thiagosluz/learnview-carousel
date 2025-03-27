
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/components/ui/use-toast";
import { createNews, updateNews, fetchNews } from '@/services';
import { FormData, formSchema } from '@/components/news/NewsFormTypes';
import { processImage } from '@/lib/imageProcessing';

export const useNewsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      course: 'all',
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
            course: news.course || 'all',
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
      setIsLoading(true);
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
          course: data.course,
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
          course: data.course,
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    previewUrl,
    isLoading,
    isEditing: !!id,
    handleImageChange,
    onSubmit
  };
};
