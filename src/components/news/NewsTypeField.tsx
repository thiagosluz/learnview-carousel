import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./NewsFormTypes";

interface NewsTypeFieldProps {
  form: UseFormReturn<FormData>;
}

export const NewsTypeField = ({ form }: NewsTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="text">Texto</SelectItem>
              <SelectItem value="image">Imagem</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
