import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UploadOptions {
  pixelId?: string;
  commentId?: string;
  maxFiles?: number;
  maxSize?: number; // em bytes
  allowedTypes?: string[];
}

interface UploadedImage {
  id: string;
  url: string;
  type: 'original' | 'thumbnail' | 'preview';
}

export function useUpload(options: UploadOptions = {}) {
  const {
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de arquivo não permitido';
    }

    if (file.size > maxSize) {
      return 'Arquivo muito grande';
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<UploadedImage[]> => {
    const formData = new FormData();
    formData.append('file', file);

    if (options.pixelId) {
      formData.append('pixelId', options.pixelId);
    }

    if (options.commentId) {
      formData.append('commentId', options.commentId);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer upload');
    }

    const data = await response.json();
    return data.images;
  };

  const upload = async (files: FileList | File[]) => {
    try {
      if (uploadedImages.length + files.length > maxFiles) {
        toast({
          title: 'Erro',
          description: `Máximo de ${maxFiles} arquivos permitido`,
          variant: 'destructive',
        });
        return;
      }

      setIsUploading(true);
      setProgress(0);

      const validFiles: File[] = [];
      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          toast({
            title: 'Erro',
            description: `${file.name}: ${error}`,
            variant: 'destructive',
          });
        } else {
          validFiles.push(file);
        }
      }

      const totalFiles = validFiles.length;
      const newImages: UploadedImage[] = [];

      for (let i = 0; i < totalFiles; i++) {
        const file = validFiles[i];
        const images = await uploadFile(file);
        newImages.push(...images);
        setProgress(((i + 1) / totalFiles) * 100);
      }

      setUploadedImages(prev => [...prev, ...newImages]);

      toast({
        title: 'Sucesso',
        description: 'Upload concluído com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao fazer upload',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const removeImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/upload/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover imagem');
      }

      setUploadedImages(prev => prev.filter(img => img.id !== imageId));

      toast({
        title: 'Sucesso',
        description: 'Imagem removida com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao remover imagem',
        variant: 'destructive',
      });
    }
  };

  return {
    upload,
    removeImage,
    isUploading,
    progress,
    uploadedImages,
  };
}
