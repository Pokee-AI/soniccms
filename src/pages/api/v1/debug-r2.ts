import type { APIRoute } from 'astro';
import { S3Client, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';

export const GET: APIRoute = async () => {
  try {
    // Check environment variables
    const config = {
      accountId: process.env.R2_ACCOUNT_ID,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ? 'Set' : 'Missing',
      bucketName: process.env.R2_BUCKET_NAME,
      publicDomain: process.env.R2_PUBLIC_DOMAIN,
      timestamp: new Date().toISOString(), // Add timestamp to prevent caching
    };

    console.log('R2 Debug - Environment check:', config);

    // Test R2 connection with enhanced configuration
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true,
      maxAttempts: 3,
      requestHandler: {
        requestTimeout: 30000,
      },
    });

    console.log('R2 Debug - Client created successfully');

    // Try to list buckets (this will test the connection)
    const command = new ListBucketsCommand({});
    console.log('R2 Debug - Attempting to list buckets...');
    const result = await client.send(command);
    console.log('R2 Debug - List buckets successful:', result);

    // Try a simple upload test
    const testContent = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in bytes
    const testKey = `test-${Date.now()}.txt`;
    
    console.log('R2 Debug - Attempting test upload...');
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'sonicjs-media',
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    });
    
    const uploadResult = await client.send(uploadCommand);
    console.log('R2 Debug - Test upload successful:', uploadResult);

    return new Response(
      JSON.stringify({
        success: true,
        config: {
          ...config,
          secretAccessKey: '***hidden***',
        },
        buckets: result.Buckets?.map(b => b.Name) || [],
        testUpload: {
          key: testKey,
          success: true,
        },
        message: 'R2 connection and upload test successful',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );

  } catch (error) {
    console.error('R2 Debug - Error:', error);
    console.error('R2 Debug - Error details:', {
      code: error.code,
      message: error.message,
      name: error.name,
      $metadata: error.$metadata,
      $response: error.$response,
      cause: error.cause,
    });
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          code: error.code,
          name: error.name,
          $metadata: error.$metadata,
        },
        config: {
          accountId: process.env.R2_ACCOUNT_ID ? 'Set' : 'Missing',
          accessKeyId: process.env.R2_ACCESS_KEY_ID ? 'Set' : 'Missing',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ? 'Set' : 'Missing',
          bucketName: process.env.R2_BUCKET_NAME,
          publicDomain: process.env.R2_PUBLIC_DOMAIN,
          timestamp: new Date().toISOString(),
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
};
