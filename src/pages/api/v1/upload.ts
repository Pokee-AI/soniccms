import type { APIContext } from 'astro';
import { r2UploadService } from '../../../services/r2-upload';

// Change the signature to receive the full APIContext
export const POST = async (context: APIContext) => {
  try {
    // Check if we're in local development mode
    const isLocalDev = import.meta.env.DEV;
    
    if (isLocalDev) {
      console.log('Running in local development mode - using S3 client for R2');
    } else {
      // --- Production: Get bindings and environment variables from the context ---
      const { env } = context.locals.runtime;
      const { R2STORAGE, R2_PUBLIC_DOMAIN } = env;
      
      // Ensure R2_PUBLIC_DOMAIN is a string
      const publicDomain = typeof R2_PUBLIC_DOMAIN === 'string' ? R2_PUBLIC_DOMAIN : '';

      // Add a check to ensure the binding is present and properly typed
      if (!R2STORAGE || typeof R2STORAGE !== 'object' || !('put' in R2STORAGE)) {
          throw new Error("R2 binding 'R2STORAGE' not found or invalid. Please check your Cloudflare Pages configuration.");
      }

      // Check if public domain is configured
      if (!publicDomain) {
          throw new Error("R2_PUBLIC_DOMAIN environment variable is not set or empty.");
      }
    }

    const formData = await context.request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: 'No files provided' }), { status: 400 });
    }

    // --- Step 2: Validate and upload files ---
    const results = await Promise.all(
      files.map(async (file) => {
        // First, validate the file itself
        const validation = r2UploadService.validateFile(file);
        if (!validation.valid) {
          return {
            success: false,
            error: validation.error,
            fileName: file.name,
          };
        }

        // Get the file content as an ArrayBuffer
        const fileBuffer = await file.arrayBuffer();

        // --- Step 3: Upload file using the service ---
        // In local dev, the service will use S3 client; in production, it will use R2 binding
        return await r2UploadService.uploadFile(
          {
            fileBody: fileBuffer,
            fileName: file.name,
            contentType: file.type,
          },
          isLocalDev ? undefined : context.locals.runtime as any
        );
      })
    );

    const failedUploads = results.filter(result => !result.success);
    if (failedUploads.length > 0) {
      return new Response(JSON.stringify({ error: 'Some files failed to upload', failedUploads }), { status: 400 });
    }

    const urls = results
      .filter((r): r is { success: true; url: string } => r.success === true && 'url' in r && typeof r.url === 'string')
      .map(r => r.url);

    return new Response(JSON.stringify({ success: true, urls, count: urls.length }), { status: 200 });

  } catch (error) {
    console.error('Upload API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
};
