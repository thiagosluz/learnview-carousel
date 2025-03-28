import { cn } from "@/lib/utils";

interface CourseTagProps {
  course: string | null | undefined;
  className?: string;
}

export const CourseTag = ({ course, className }: CourseTagProps) => {
  if (!course || course === 'all') return null;
  
  const tagColorMap: Record<string, string> = {
    'TADS': 'bg-primary/90',
    'MSI': 'bg-[#33C3F0]/90',
    'Esp. IE': 'bg-[#F97316]/90',
  };
  
  const tagColor = tagColorMap[course] || 'bg-primary/90';
  
  return (
    <div 
      className={cn(
        "absolute top-2 right-2 z-10 px-2 py-1 rounded-md text-xs font-medium text-white shadow-xs",
        tagColor,
        className
      )}
    >
      {course}
    </div>
  );
};
