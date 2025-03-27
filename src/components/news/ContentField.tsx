
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./NewsFormTypes";
import { ImageUploadField } from "./ImageUploadField";

interface ContentFieldProps {
  form: UseFormReturn<FormData>;
  previewUrl: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContentField = ({ form, previewUrl, onImageChange }: ContentFieldProps) => {
  const isImageType = form.watch('type') === 'image';
  
  return (
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
                onImageChange={onImageChange}
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
  );
};
