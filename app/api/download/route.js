import { NextResponse } from 'next/server';
import { processZip } from '@/lib/zipUtils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.zip')) {
      return NextResponse.json(
        { error: 'Please upload a .zip file' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer for processing
    const arrayBuffer = await file.arrayBuffer();

    // Process ZIP file using the utility function
    const result = await processZip(arrayBuffer);

    // Create response with markdown content as downloadable file
    const response = new NextResponse(result.finalMarkdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${result.originalMarkdownName || 'converted.md'}"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error processing ZIP:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing the file' },
      { status: 500 }
    );
  }
}
