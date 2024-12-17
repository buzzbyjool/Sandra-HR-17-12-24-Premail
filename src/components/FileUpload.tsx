import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { uploadFile, UploadError } from '../services/uploadService';
import { UPLOAD_CONFIG, cloudinaryConfig } from '../config/cloudinary';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUploadComplete: (url: string) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function FileUpload({ 
  onFileSelect, 
  onUploadComplete, 
  selectedFile, 
  onClear 
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      setUploadError('System configuration error. Please contact support.');
      toast.error('Upload system unavailable');
      onClear();
      return;
    }

    const toastId = toast.loading('Analyzing CV...');
    
    try {
      setUploading(true);
      setUploadError(null);
      
      const url = await uploadFile(file);
      if (!url) {
        throw new Error('CV upload completed but URL generation failed');
      }

      onUploadComplete(url);
      
      toast.success('CV uploaded and ready for analysis', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage;
      if (error instanceof Error) {
        if (error.name === 'WebhookError') {
          errorMessage = 'CV analysis failed. Please try again or contact support.';
        } else if (error instanceof UploadError) {
          errorMessage = error.message;
        } else {
          errorMessage = 'CV upload failed. Please try again.';
        }
      }
      
      setUploadError(errorMessage);
      toast.error(errorMessage, { id: toastId });
      onClear();
    } finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file size
      if (file.size > UPLOAD_CONFIG.maxFileSize) {
        const maxSizeMB = UPLOAD_CONFIG.maxFileSize / (1024 * 1024);
        const errorMsg = `CV file must be smaller than ${maxSizeMB}MB`;
        setUploadError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Validate file type
      const fileType = Object.keys(UPLOAD_CONFIG.allowedFileTypes).find(type => 
        file.type === type || UPLOAD_CONFIG.allowedFileTypes[type].includes(`.${file.name.split('.').pop()?.toLowerCase()}`)
      );

      if (!fileType) {
        const errorMsg = 'Please upload your CV in PDF, DOC, DOCX, or ODT format';
        setUploadError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      onFileSelect(file);
      handleUpload(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: UPLOAD_CONFIG.allowedFileTypes,
    maxFiles: 1,
    multiple: false,
    maxSize: UPLOAD_CONFIG.maxFileSize
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 
          ${uploading ? 'pointer-events-none opacity-50' :
            isDragActive 
            ? 'border-indigo-400 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-300 bg-gray-50 hover:bg-gray-100'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload 
            size={24} 
            className={`mb-2 ${
              uploading ? 'text-gray-400 animate-pulse' :
              isDragActive ? 'text-indigo-500' : 'text-gray-400'
            }`}
            style={{ opacity: uploading ? 0.5 : 1 }}
          />
          <p className="text-sm text-gray-600">
            {uploading ? 'Uploading CV...' : 
             isDragActive ? 'Drop the CV here' : 
             'Drag and drop a CV, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, ODT
          </p>
        </div>
        {uploadError && (
          <div className="mt-2 text-sm text-red-600 text-center">
            {uploadError}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <File size={20} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}