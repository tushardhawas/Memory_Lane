import React, { useRef } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useFileUpload from '@/hooks/use-file-upload';

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect?: (file: File) => void;
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  label?: string;
  description?: string;
  showPreview?: boolean;
  previewHeight?: string;
  buttonText?: string;
  icon?: React.ReactNode;
}

const FileUpload = ({
  onFileSelect,
  maxSizeInMB = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  label = 'Upload a file',
  description = 'Drag and drop a file here, or click to select a file',
  showPreview = true,
  previewHeight = 'h-64',
  buttonText = 'Select File',
  icon = <FiUpload className="h-6 w-6" />,
  className,
  ...props
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    file,
    preview,
    error,
    isLoading,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    reset
  } = useFileUpload({
    maxSizeInMB,
    acceptedFileTypes,
    onUploadSuccess: (file) => {
      onFileSelect?.(file);
    }
  });

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isPdf = file?.type === 'application/pdf';

  return (
    <div className={cn('w-full', className)} {...props}>
      {label && <p className="text-sm font-medium mb-2">{label}</p>}
      
      {!file && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6',
            'flex flex-col items-center justify-center text-center',
            'transition-colors duration-200',
            'hover:bg-muted/50 cursor-pointer'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onClick={handleButtonClick}
        >
          <div className="mb-4 text-muted-foreground">
            {icon}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <p className="text-xs text-muted-foreground">
            Max file size: {maxSizeInMB}MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(',')}
          />
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}

      {file && showPreview && (
        <div className="mt-4 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={reset}
            >
              <FiX className="h-4 w-4" />
            </Button>
          </div>
          
          {isPdf ? (
            <div className={cn('flex items-center justify-center border rounded-lg bg-muted/50', previewHeight)}>
              <div className="flex flex-col items-center text-muted-foreground">
                <FiFile className="h-12 w-12 mb-2" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ) : (
            preview && (
              <div className={cn('relative rounded-lg overflow-hidden', previewHeight)}>
                <img
                  src={preview}
                  alt="File preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )
          )}
        </div>
      )}

      {file && (
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          
          {!showPreview && (
            <Button
              variant="destructive"
              size="sm"
              onClick={reset}
            >
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
