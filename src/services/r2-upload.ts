import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { R2Bucket } from '@cloudflare/workers-types';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// This interface helps TypeScript understand the Cloudflare environment.
declare global {
  namespace App.Locals {
    interface Runtime {
      env: {
        R2STORAGE: R2Bucket;
        R2_PUBLIC_DOMAIN: string;
      };
    }
  }
}

export class R2UploadService {
  private s3Client: S3Client | null = null;
  private isLocalDev = false;
  private localConfig: { bucketName: string; publicDomain: string } | null = null;

  constructor() {
    // This uses Astro's environment variable to detect if we are in development mode.
    if (import.meta.env.DEV) {
      this.isLocalDev = true;
      console.log('R2UploadService: Running in local development mode.');

      // In dev mode, we configure the S3 client using .env variables
      const accountId = import.meta.env.R2_ACCOUNT_ID;
      const accessKeyId = import.meta.env.R2_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.R2_SECRET_ACCESS_KEY;
      const bucketName = import.meta.env.R2_BUCKET_NAME;
      const publicDomain = import.meta.env.R2_PUBLIC_DOMAIN;

      if (accountId && accessKeyId && secretAccessKey && bucketName && publicDomain) {
        this.s3Client = new S3Client({
          region: 'auto',
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
        this.localConfig = { bucketName, publicDomain };
        console.log('R2UploadService: S3 client configured for local R2 access.');
      } else {
        console.error('R2UploadService: Missing R2 environment variables for local development.');
      }
    }
  }

  async uploadFile(
    fileDetails: {
      fileBody: ArrayBuffer;
      fileName: string;
      contentType: string;
    },
    runtime?: App.Locals.Runtime
  ): Promise<UploadResult> {
    const { fileBody, fileName, contentType } = fileDetails;

    // --- Production Path (using R2 Binding) ---
    if (runtime?.env?.R2STORAGE) {
      const bucket = runtime.env.R2STORAGE;
      const publicDomain = runtime.env.R2_PUBLIC_DOMAIN;
      
      if (!publicDomain) {
          return { success: false, error: 'Production environment missing R2_PUBLIC_DOMAIN.' };
      }

      try {
        const key = this.generateUniqueKey(fileName);
        await bucket.put(key, fileBody, { httpMetadata: { contentType } });
        const publicUrl = `https://${publicDomain}/${key}`;
        return { success: true, url: publicUrl };
      } catch (error: any) {
        console.error('R2 binding upload error:', error);
        return { success: false, error: error.message };
      }
    }

    // --- Local Development Path (using S3 Client) ---
    if (this.isLocalDev && this.s3Client && this.localConfig) {
      try {
        const key = this.generateUniqueKey(fileName);
        const command = new PutObjectCommand({
          Bucket: this.localConfig.bucketName,
          Key: key,
          Body: new Uint8Array(fileBody),
          ContentType: contentType,
          ACL: 'public-read',
        });

        await this.s3Client.send(command);
        const publicUrl = `https://${this.localConfig.publicDomain}/${key}`;
        return { success: true, url: publicUrl };
      } catch (error: any) {
        console.error('Local R2 upload error:', error);
        return { success: false, error: error.message };
      }
    }

    // --- Error Path ---
    return {
      success: false,
      error: 'R2 service is not configured for either production or local development.',
    };
  }
  
  private generateUniqueKey(fileName: string): string {
      const timestamp = Date.now();
      const sanitizedFileName = this.sanitizeFileName(fileName);
      return `blog-posts/${timestamp}-${sanitizedFileName}`;
  }

  // sanitizeFileName and validateFile methods remain the same
  sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[,\s]/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 50MB' };
    }
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    ];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported.' };
    }
    return { valid: true };
  }
}

export const r2UploadService = new R2UploadService();