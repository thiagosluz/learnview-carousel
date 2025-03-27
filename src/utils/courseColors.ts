
// Define course color mapping
export const courseColors = {
  'TADS': 'bg-primary text-white',
  'MSI': 'bg-[#33C3F0] text-white',
  'ESINF': 'bg-[#8B5CF6] text-white',
  'Esp. em Informática na Educação': 'bg-[#F97316] text-white',
};

export const getClassHighlightColor = (course: string) => {
  return courseColors[course as keyof typeof courseColors] || courseColors['TADS'];
};

// Lista de cursos para seleção
export const courseOptions = [
  { value: 'TADS', label: 'TADS' },
  { value: 'MSI', label: 'MSI' },
  { value: 'ESINF', label: 'ESINF' },
  { value: 'Esp. em Informática na Educação', label: 'Esp. em Informática na Educação' },
  { value: 'all', label: 'Todos os cursos' }
];
