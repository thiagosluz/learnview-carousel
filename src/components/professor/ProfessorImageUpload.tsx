import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ProfessorImageUploadProps {
  previewUrl: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldProps?: any;
}

export const ProfessorImageUpload = ({ 
  previewUrl, 
  onImageChange, 
  fieldProps 
}: ProfessorImageUploadProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          id="professor-photo-upload"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
        />
        <Label
          htmlFor="professor-photo-upload"
          className={cn(
            "flex min-h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100",
            previewUrl && "border-primary"
          )}
        >
          {previewUrl ? (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[300px] max-w-full object-contain rounded"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
                2700 × 2700
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              <svg
                className="mb-3 h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">
                A foto será processada na proporção 1:1 (2700 × 2700 pixels)
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Será convertida para WebP para melhor desempenho em TV 4K
              </p>
            </div>
          )}
        </Label>
      </div>
      {fieldProps && (
        <Input 
          {...fieldProps}
          type="hidden"
        />
      )}
    </div>
  );
}; 