import { cloudinaryConfig, UPLOAD_CONFIG } from '../config/cloudinary';

export class UploadError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'UploadError';
  }
}

export async function uploadFile(file: File): Promise<string> {
  if (!file) {
    throw new UploadError('No file selected. Please choose a CV to upload.');
  }

  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    const maxSizeMB = UPLOAD_CONFIG.maxFileSize / (1024 * 1024);
    throw new UploadError(`File is too large. Maximum size allowed is ${maxSizeMB}MB`);
  }

  // Validate file type early
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const isValidType = Object.entries(UPLOAD_CONFIG.allowedFileTypes).some(([type, extensions]) => 
    file.type === type || extensions.includes(`.${fileExtension}`)
  );

  if (!isValidType) {
    throw new UploadError('Invalid file type. Please upload a PDF, DOC, DOCX, or ODT file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);
  formData.append('folder', UPLOAD_CONFIG.uploadFolder);
  
  // Set resource type based on file type
  const resourceType = file.type === 'application/pdf' ? 'raw' : 'auto';
  formData.append('resource_type', resourceType);

  try {
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      let errorMessage = 'Upload failed';
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (response.status === 401) {
        errorMessage = 'Upload authentication failed. Please try again.';
      } else if (response.status === 413) {
        errorMessage = 'File exceeds server upload limit. Please try a smaller file.';
      } else if (response.status === 415) {
        errorMessage = 'File type not supported. Please use PDF, DOC, DOCX, or ODT format.';
      } else if (response.status >= 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      }
      throw new UploadError(errorMessage, errorData);
    }

    const data = await response.json();
    
    if (!data.secure_url) {
      throw new UploadError('File uploaded but URL generation failed. Please try again.');
    }

    // For PDFs, construct URL with explicit version
    if (file.type === 'application/pdf') {
      const version = `v${data.version}`;  // Add 'v' prefix to version
      const publicId = data.public_id;
      return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/raw/upload/${version}/${publicId}`;
    }
    
    return data.secure_url;
  } catch (error) {
    if (error instanceof UploadError) {
      throw error;
    }
    
    let errorMessage = 'Failed to upload file';
    if (error instanceof Error) {
      console.error('Upload error:', error.message);
      errorMessage = error.message;
    } else {
      console.error('Unknown upload error:', error);
    }
    
    throw new UploadError(errorMessage, error);
  }
}