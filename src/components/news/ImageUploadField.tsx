
import { Input } from "@/components/ui/input";

interface ImageUploadFieldProps {
  previewUrl: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldProps: any;
}

export const ImageUploadField = ({ 
  previewUrl, 
  onImageChange, 
  fieldProps 
}: ImageUploadFieldProps) => {
  return (
    <div className="space-y-4">
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full max-h-[300px] object-contain rounded-lg border"
        />
      )}
      <Input 
        type="file"
        accept="image/*"
        onChange={onImageChange}
      />
      <Input 
        {...fieldProps}
        type="hidden"
      />
    </div>
  );
};
