
import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Crop, ZoomIn, ZoomOut, Check } from "lucide-react";

interface ImageUploadFieldProps {
  previewUrl: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldProps: any;
  onProcessedImageChange?: (file: File) => void;
}

export const ImageUploadField = ({ 
  previewUrl, 
  onImageChange, 
  fieldProps,
  onProcessedImageChange
}: ImageUploadFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const TARGET_WIDTH = 1080;
  const TARGET_HEIGHT = 1350;
  const ASPECT_RATIO = 4/5;

  useEffect(() => {
    if (previewUrl && isEditing) {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        drawImageToCanvas();
      };
      img.src = previewUrl;
    }
  }, [previewUrl, isEditing, zoom, position]);

  const drawImageToCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image with current zoom and position
    const img = imageRef.current;
    const scaledWidth = img.width * zoom;
    const scaledHeight = img.height * zoom;
    
    ctx.drawImage(
      img,
      -position.x,
      -position.y,
      scaledWidth,
      scaledHeight
    );
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSaveImage = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], "processed-image.jpg", { type: "image/jpeg" });
      if (onProcessedImageChange) {
        onProcessedImageChange(file);
      }
      setIsEditing(false);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="space-y-4">
      {previewUrl && !isEditing && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-[300px] object-contain rounded-lg border"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="absolute bottom-2 right-2"
            onClick={handleStartEditing}
          >
            <Crop className="h-4 w-4 mr-1" /> Editar
          </Button>
        </div>
      )}
      
      {isEditing && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Ajuste a imagem para o tamanho 4:5 (1080 x 1350 pixels)
          </div>
          <div className="relative border rounded-lg overflow-hidden" 
               style={{width: '100%', maxWidth: '540px', margin: '0 auto'}}>
            <canvas
              ref={canvasRef}
              width={TARGET_WIDTH}
              height={TARGET_HEIGHT}
              className="w-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{maxHeight: '400px', objectFit: 'contain'}}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button type="button" size="icon" variant="secondary" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="secondary" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="button" onClick={handleSaveImage}>
              <Check className="h-4 w-4 mr-1" /> Salvar
            </Button>
          </div>
        </div>
      )}
      
      <Input 
        type="file"
        accept="image/*"
        onChange={onImageChange}
        disabled={isEditing}
      />
      <Input 
        {...fieldProps}
        type="hidden"
      />
    </div>
  );
};
