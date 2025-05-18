import { useState, useCallback } from 'react';

interface FileUploadState {
  file: File | null;
  preview: string | null;
  error: string | null;
  isLoading: boolean;
}

interface UseFileUploadOptions {
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  onUploadStart?: () => void;
  onUploadSuccess?: (file: File, preview: string) => void;
  onUploadError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSizeInMB = 5,
    acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    onUploadStart,
    onUploadSuccess,
    onUploadError,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    file: null,
    preview: null,
    error: null,
    isLoading: false,
  });

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedFileTypes.includes(file.type)) {
      return `File type not supported. Please upload ${acceptedFileTypes.join(', ')}`;
    }

    if (file.size > maxSizeInBytes) {
      return `File size exceeds ${maxSizeInMB}MB limit`;
    }

    return null;
  }, [acceptedFileTypes, maxSizeInBytes, maxSizeInMB]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      return;
    }

    const file = fileList[0];
    handleFile(file);
  }, []);

  const handleFile = useCallback((file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    onUploadStart?.();

    const validationError = validateFile(file);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError, isLoading: false }));
      onUploadError?.(validationError);
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setState({
      file,
      preview: previewUrl,
      error: null,
      isLoading: false,
    });

    onUploadSuccess?.(file, previewUrl);
  }, [onUploadError, onUploadStart, onUploadSuccess, validateFile]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const reset = useCallback(() => {
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }
    setState({
      file: null,
      preview: null,
      error: null,
      isLoading: false,
    });
  }, [state.preview]);

  return {
    ...state,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    reset,
  };
}

export default useFileUpload;
