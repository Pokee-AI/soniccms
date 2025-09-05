import type { APIRoute } from 'astro';
import { r2UploadService } from '../../../services/r2-upload';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files provided' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Convert Files to Uint8Array for R2 upload
    const fileBuffers = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        return {
          buffer: new Uint8Array(arrayBuffer),
          fileName: file.name,
          contentType: file.type,
        };
      })
    );

    // Validate and upload files to R2
    const results = await Promise.all(
      fileBuffers.map(async (fileData) => {
        // Create a mock File object for validation
        const mockFile = {
          name: fileData.fileName,
          type: fileData.contentType,
          size: fileData.buffer.length,
        } as File;

        const validation = r2UploadService.validateFile(mockFile);
        if (!validation.valid) {
          return {
            success: false,
            error: validation.error,
          };
        }

        return await r2UploadService.uploadFile(
          fileData.buffer,
          fileData.fileName,
          fileData.contentType
        );
      })
    );

    // Check if any uploads failed
    const failedUploads = results.filter(result => !result.success);
    if (failedUploads.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Some files failed to upload',
          failedUploads 
        }),
        { status: 400 }
      );
    }

    // Extract successful URLs
    const urls = results
      .filter(result => result.success)
      .map(result => result.url)
      .filter(Boolean);

    return new Response(
      JSON.stringify({ 
        success: true, 
        urls,
        count: urls.length 
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Upload API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
