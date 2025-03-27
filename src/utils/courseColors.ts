
// Define course color mapping
export const courseColors = {
  'TADS': 'bg-primary text-white',
  'MSI': 'bg-[#33C3F0] text-white',
  'ESINF': 'bg-[#8B5CF6] text-white',
  'Especialização em Informática na Educação': 'bg-[#F97316] text-white',
};

export const getClassHighlightColor = (course: string) => {
  return courseColors[course as keyof typeof courseColors] || courseColors['TADS'];
};
