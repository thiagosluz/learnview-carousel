// Define course color mapping
const courseColors = {
  'TADS': 'bg-primary text-white',
  'MSI': 'bg-[#33C3F0] text-white',
  'Esp. IE': 'bg-[#F97316] text-white',
} as const;

export const getClassHighlightColor = (course: string) => {
  return courseColors[course as keyof typeof courseColors] || courseColors['TADS'];
};

// Lista de cursos para seleção
export const courseOptions = [
  { value: 'TADS', label: 'TADS' },
  { value: 'MSI', label: 'MSI' },
  { value: 'Esp. IE', label: 'Especialização em Informática na Educação' },
  { value: 'all', label: 'Todos os cursos' }
];
