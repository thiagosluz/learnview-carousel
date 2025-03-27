
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { NewsFormHeader } from '@/components/news/NewsFormHeader';
import { TitleField } from '@/components/news/TitleField';
import { NewsTypeField } from '@/components/news/NewsTypeField';
import { CourseSelectField } from '@/components/news/CourseSelectField';
import { ContentField } from '@/components/news/ContentField';
import { DateTimeFields } from '@/components/news/DateTimeFields';
import { ActiveToggleField } from '@/components/news/ActiveToggleField';
import { useNewsForm } from '@/hooks/useNewsForm';

const NewsForm = () => {
  const {
    form,
    previewUrl,
    isLoading,
    isEditing,
    handleImageChange,
    onSubmit
  } = useNewsForm();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <NewsFormHeader isEditing={isEditing} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TitleField form={form} />
            
            <NewsTypeField form={form} />
            
            <CourseSelectField form={form} />
            
            <ContentField 
              form={form} 
              previewUrl={previewUrl} 
              onImageChange={handleImageChange} 
            />
            
            <DateTimeFields form={form} />
            
            <ActiveToggleField form={form} />

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewsForm;
