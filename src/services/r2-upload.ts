import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// ! always comment this out before pushing to prod
// import 'dotenv/config';
// 

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface FileMetadata {
  name: string;
  type: string;
  size: number;
}

export class R2UploadService {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.R2_BUCKET_NAME || 'sonicjs-media';

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true, // Required for R2
      maxAttempts: 3, // Retry failed requests
      requestHandler: {
        requestTimeout: 30000, // 30 second timeout
      },
    });
  }

  async uploadFile(
    file: File | Uint8Array,
    fileName: string,
    contentType: string
  ): Promise<UploadResult> {
    try {
      // Generate unique filename to prevent conflicts
      const timestamp = Date.now();
      
      // Sanitize the filename to remove problematic characters
      const sanitizedFileName = this.sanitizeFileName(fileName);
      const uniqueFileName = `${timestamp}-${sanitizedFileName}`;
      const key = `blog-posts/${uniqueFileName}`;

      // Convert File to Uint8Array if needed
      let fileBuffer: Uint8Array;
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        fileBuffer = new Uint8Array(arrayBuffer);
      } else {
        fileBuffer = file;
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: 'public-read', // Make files publicly accessible
      });

      await this.client.send(command);

      // Return the public URL
      const publicUrl = `https://${process.env.R2_PUBLIC_DOMAIN || `pub-${process.env.R2_ACCOUNT_ID}.r2.dev`}/${key}`;

      return {
        success: true,
        url: publicUrl,
      };
    } catch (error) {
      console.error('R2 upload error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
        name: error.name,
        $metadata: error.$metadata,
        $response: error.$response,
        cause: error.cause,
        requestId: error.$metadata?.requestId,
        httpStatusCode: error.$metadata?.httpStatusCode,
      });
      
      // Log the raw response if available
      if (error.$response) {
        console.error('Raw response:', {
          statusCode: error.$response.statusCode,
          headers: error.$response.headers,
          body: error.$response.body,
        });
      }
      
      // Extract more detailed error information
      let errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      
      if (error.code) {
        errorMessage = `${error.code}: ${errorMessage}`;
      }
      
      if (error.name === 'NetworkError' || error.message?.includes('Network connection lost')) {
        errorMessage = `Network connectivity issue: ${errorMessage}. Please check your R2 configuration and network connection.`;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  sanitizeFileName(fileName: string): string {
    // Remove or replace problematic characters
    return fileName
      .replace(/[,\s]/g, '_') // Replace commas and spaces with underscores
      .replace(/[^a-zA-Z0-9._-]/g, '') // Remove any other special characters except dots, underscores, and hyphens
      .replace(/_{2,}/g, '_') // Replace multiple consecutive underscores with single underscore
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 50MB' };
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please upload images (JPEG, PNG, GIF, WebP) or videos (MP4, WebM, OGG, MOV)',
      };
    }

    return { valid: true };
  }


}

export const r2UploadService = new R2UploadService();
