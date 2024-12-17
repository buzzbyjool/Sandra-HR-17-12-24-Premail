import { z } from 'zod';

const cloudinaryConfigSchema = z.object({
  cloudName: z.string().min(1, 'Cloudinary cloud name is required'),
  uploadPreset: z.string().min(1, 'Cloudinary upload preset is required'),
});

const config = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

export const cloudinaryConfig = cloudinaryConfigSchema.parse(config);

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc', '.docx'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.oasis.opendocument.text': ['.odt']
  },
  uploadFolder: 'cv_uploads'
} as const;

export function getCloudinaryUrl(publicId: string, version: string, options: { format: string }) {
  const { cloudName } = cloudinaryConfig;
  const baseUrl = `https://res.cloudinary.com/${cloudName}`;
  const versionWithPrefix = version.startsWith('v') ? version : `v${version}`;
  
  if (options.format === 'pdf') {
    return `${baseUrl}/raw/upload/${versionWithPrefix}/${publicId}`;
  }
  
  return `${baseUrl}/upload/${versionWithPrefix}/${publicId}`;
}