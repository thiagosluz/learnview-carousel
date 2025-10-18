import { ExternalLink } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormData } from './NewsFormTypes';

interface LinkFieldProps {
  form: UseFormReturn<FormData>;
}

export const LinkField = ({ form }: LinkFieldProps) => {
  const linkValue = form.watch('link');
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link (opcional)</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  placeholder="https://exemplo.com" 
                  {...field}
                  value={field.value || ''}
                  className="pr-10"
                />
                <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </FormControl>
            <FormDescription>
              Adicione um link para tornar a notícia clicável. O usuário será redirecionado ao clicar.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_clickable"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Marcar como clicável
              </FormLabel>
              <FormDescription>
                Exibe um indicador visual mostrando que a notícia é clicável
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={!linkValue}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
