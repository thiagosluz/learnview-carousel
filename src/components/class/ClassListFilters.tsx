import { Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const DIAS_SEMANA = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];

export const LABORATORIOS = [
  'Laboratório 01',
  'Laboratório 02',
  'Laboratório 03',
  'Laboratório 04',
  'Laboratório TADS 01',
  'Laboratório TADS 02',
  'Laboratório TADS 03',
  'Laboratório REDES',
  'Laboratório MSI 01',
  'Laboratório MSI 02',
  'EAD'
];

interface ClassListFiltersProps {
  dayFilter: string;
  timeFilter: string;
  professorFilter: string;
  subjectFilter: string;
  labFilter: string[];
  onFilterChange: (value: string | string[], setFilter: (value: any) => void) => void;
  setDayFilter: (value: string) => void;
  setTimeFilter: (value: string) => void;
  setProfessorFilter: (value: string) => void;
  setSubjectFilter: (value: string) => void;
  setLabFilter: (value: string[]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export const ClassListFilters = ({
  dayFilter,
  timeFilter,
  professorFilter,
  subjectFilter,
  labFilter,
  onFilterChange,
  setDayFilter,
  setTimeFilter,
  setProfessorFilter,
  setSubjectFilter,
  setLabFilter,
  clearFilters,
  hasActiveFilters
}: ClassListFiltersProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="relative">
          <Select
            value={dayFilter}
            onValueChange={(value) => onFilterChange(value, setDayFilter)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Dia da semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os dias</SelectItem>
              {DIAS_SEMANA.map((dia, index) => (
                <SelectItem key={index} value={dia}>{dia}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Input
            placeholder="Filtrar por horário..."
            value={timeFilter}
            onChange={(e) => onFilterChange(e.target.value, setTimeFilter)}
            className="w-full"
          />
        </div>

        <div className="relative">
          <Input
            placeholder="Filtrar por professor..."
            value={professorFilter}
            onChange={(e) => onFilterChange(e.target.value, setProfessorFilter)}
            className="w-full"
          />
        </div>

        <div className="relative">
          <Input
            placeholder="Filtrar por disciplina..."
            value={subjectFilter}
            onChange={(e) => onFilterChange(e.target.value, setSubjectFilter)}
            className="w-full"
          />
        </div>

        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  labFilter.length > 0 && "text-zinc-900"
                )}
              >
                {labFilter.length === 0
                  ? "Selecionar laboratórios"
                  : `${labFilter.length} selecionado${labFilter.length === 1 ? '' : 's'}`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white shadow-md border border-gray-200">
              <Command className="bg-white">
                <CommandInput placeholder="Buscar laboratório..." className="border-0" />
                <CommandEmpty className="py-2 text-center text-sm text-gray-600">Nenhum laboratório encontrado.</CommandEmpty>
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {LABORATORIOS.map((lab) => (
                    <CommandItem
                      key={lab}
                      onSelect={() => {
                        const newValue = labFilter.includes(lab)
                          ? labFilter.filter((l) => l !== lab)
                          : [...labFilter, lab];
                        onFilterChange(newValue, setLabFilter);
                      }}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <Checkbox
                        checked={labFilter.includes(lab)}
                        className="mr-2"
                      />
                      {lab}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="text-sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
      )}
    </>
  );
};
