/**
 * Utilitário para processamento de imagens com proporção específica
 */

/**
 * Processa a imagem para a proporção 4:5 (2160x2700px)
 * mantendo a imagem inteira e com fundo que combine
 */
export const processImage = async (file: File): Promise<File> => {
  // Extrair a cor dominante para usar como fundo
  const backgroundColor = await extractDominantColor(file);
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Definir as dimensões do canvas (proporção 4:5)
      const width = 2160;
      const height = 2700;
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Preencher o canvas com a cor de fundo
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      
      // Calcular dimensões para manter a proporção da imagem original
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = width / height;
      
      let drawWidth = width;
      let drawHeight = height;
      let x = 0;
      let y = 0;
      
      if (imgAspectRatio > canvasAspectRatio) {
        // Imagem mais larga que o canvas
        drawHeight = width / imgAspectRatio;
        y = (height - drawHeight) / 2;
      } else {
        // Imagem mais alta que o canvas
        drawWidth = height * imgAspectRatio;
        x = (width - drawWidth) / 2;
      }
      
      // Desenhar a imagem centralizada
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      // Converter o canvas para blob em formato WebP para melhor desempenho
      if (supportsWebP()) {
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Could not convert canvas to blob');
          // Manter a extensão original do arquivo, mas usar o formato WebP
          const fileName = getFileNameWithoutExtension(file.name) + '.webp';
          const processedFile = new File([blob], fileName, { type: 'image/webp' });
          resolve(processedFile);
        }, 'image/webp', 0.92);
      } else {
        // Fallback para JPEG se o WebP não for suportado
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Could not convert canvas to blob');
          const processedFile = new File([blob], file.name, { type: 'image/jpeg' });
          resolve(processedFile);
        }, 'image/jpeg', 0.95);
      }
    };
    
    img.onerror = () => {
      // Em caso de erro, retornar o arquivo original
      resolve(file);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Verifica se o navegador suporta WebP
 */
const supportsWebP = (): boolean => {
  // Verificação simplificada - em browsers modernos o WebP é amplamente suportado
  try {
    return document.createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') === 0;
  } catch (e) {
    return false;
  }
};

/**
 * Retorna o nome do arquivo sem a extensão
 */
const getFileNameWithoutExtension = (fileName: string): string => {
  return fileName.split('.').slice(0, -1).join('.') || fileName;
};

/**
 * Extrai a cor dominante de uma imagem para usar como fundo
 */
export const extractDominantColor = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Usar uma versão reduzida para melhor performance
      canvas.width = Math.min(img.width, 50);
      canvas.height = Math.min(img.height, 50);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('#f8f9fa'); // Fallback para cinza claro
        return;
      }
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorCounts: Record<string, number> = {};
      
      // Analisar os pixels para encontrar cores mais frequentes
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        
        // Ignorar pixels muito escuros ou muito claros
        if ((r + g + b) < 100 || (r + g + b) > 700) continue;
        
        // Simplificar a cor para evitar muitas variações
        const simpleR = Math.floor(r / 10) * 10;
        const simpleG = Math.floor(g / 10) * 10;
        const simpleB = Math.floor(b / 10) * 10;
        
        const key = `${simpleR},${simpleG},${simpleB}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }
      
      // Encontrar a cor mais frequente
      let maxCount = 0;
      let dominantColor = '#f8f9fa'; // Padrão: cinza claro
      
      for (const key in colorCounts) {
        if (colorCounts[key] > maxCount) {
          maxCount = colorCounts[key];
          const [r, g, b] = key.split(',').map(Number);
          dominantColor = `rgb(${r}, ${g}, ${b})`;
        }
      }
      
      resolve(dominantColor);
    };
    
    img.onerror = () => {
      resolve('#f8f9fa'); // Fallback para cinza claro
    };
    
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Processa a imagem do professor para a proporção 1:1 (2700x2700px)
 * mantendo a imagem inteira e com fundo que combine
 */
export const processProfessorImage = async (file: File): Promise<File> => {
  // Extrair a cor dominante para usar como fundo
  const backgroundColor = await extractDominantColor(file);
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Definir as dimensões do canvas (proporção 1:1)
      const size = 2700;
      
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Preencher o canvas com a cor de fundo
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);
      
      // Calcular dimensões para manter a proporção da imagem original
      const imgAspectRatio = img.width / img.height;
      
      let drawWidth, drawHeight, x, y;
      
      if (imgAspectRatio > 1) {
        // Imagem mais larga que alta
        drawWidth = size;
        drawHeight = size / imgAspectRatio;
        x = 0;
        y = (size - drawHeight) / 2;
      } else {
        // Imagem mais alta que larga
        drawHeight = size;
        drawWidth = size * imgAspectRatio;
        x = (size - drawWidth) / 2;
        y = 0;
      }
      
      // Desenhar a imagem centralizada
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      
      // Converter o canvas para blob em formato WebP para melhor desempenho
      if (supportsWebP()) {
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Could not convert canvas to blob');
          // Manter a extensão original do arquivo, mas usar o formato WebP
          const fileName = getFileNameWithoutExtension(file.name) + '.webp';
          const processedFile = new File([blob], fileName, { type: 'image/webp' });
          resolve(processedFile);
        }, 'image/webp', 0.92);
      } else {
        // Fallback para JPEG se o WebP não for suportado
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Could not convert canvas to blob');
          const processedFile = new File([blob], file.name, { type: 'image/jpeg' });
          resolve(processedFile);
        }, 'image/jpeg', 0.95);
      }
    };
    
    img.onerror = () => {
      // Em caso de erro, retornar o arquivo original
      resolve(file);
    };
    
    img.src = URL.createObjectURL(file);
  });
}; 