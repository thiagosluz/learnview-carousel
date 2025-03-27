
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./NewsFormTypes";

interface DateTimeFieldsProps {
  form: UseFormReturn<FormData>;
}

export const DateTimeFields = ({ form }: DateTimeFieldsProps) => {
  return (
    <>
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
    </>
  );
};
