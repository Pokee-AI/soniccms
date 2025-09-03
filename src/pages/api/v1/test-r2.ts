import type { APIRoute } from 'astro';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

export const GET: APIRoute = async () => {
  try {
    // Check environment variables
    const config = {
      accountId: process.env.R2_ACCOUNT_ID,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ? 'Set' : 'Missing',
      bucketName: process.env.R2_BUCKET_NAME,
      publicDomain: process.env.R2_PUBLIC_DOMAIN,
    };

    // Test R2 connection
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true,
    });

    // Try to list buckets (this will test the connection)
    const command = new ListBucketsCommand({});
    const result = await client.send(command);

    return new Response(
      JSON.stringify({
        success: true,
        config: {
          ...config,
          secretAccessKey: '***hidden***', // Don't expose the secret
        },
        buckets: result.Buckets?.map(b => b.Name) || [],
        message: 'R2 connection successful',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('R2 test error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          code: error.code,
          name: error.name,
        },
        config: {
          accountId: process.env.R2_ACCOUNT_ID ? 'Set' : 'Missing',
          accessKeyId: process.env.R2_ACCESS_KEY_ID ? 'Set' : 'Missing',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ? 'Set' : 'Missing',
          bucketName: process.env.R2_BUCKET_NAME,
          publicDomain: process.env.R2_PUBLIC_DOMAIN,
        },
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
