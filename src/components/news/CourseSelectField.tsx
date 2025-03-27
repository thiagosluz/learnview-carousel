
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./NewsFormTypes";
import { courseOptions } from "@/utils/courseColors";

interface CourseSelectFieldProps {
  form: UseFormReturn<FormData>;
}

export const CourseSelectField = ({ form }: CourseSelectFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="course"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Curso</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || 'all'}
            defaultValue="all"
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o curso" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {courseOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
