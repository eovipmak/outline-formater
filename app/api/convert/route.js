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

    // Convert File to Blob for processing
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer]);

    // Process ZIP file using the utility function
    const result = await processZip(blob);

    return NextResponse.json({
      markdown: result.finalMarkdown,
      filename: result.originalMarkdownName,
    });
  } catch (error) {
    console.error('Error processing ZIP:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing the file' },
      { status: 500 }
    );
  }
}
