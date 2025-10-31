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
    
    // Validate ZIP file magic bytes (PK\x03\x04 or PK\x05\x06)
    const bytes = new Uint8Array(arrayBuffer);
    const isZip = bytes.length >= 4 && 
                  bytes[0] === 0x50 && bytes[1] === 0x4B && 
                  (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
                  (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08);
    
    if (!isZip) {
      return NextResponse.json(
        { error: 'Invalid ZIP file format' },
        { status: 400 }
      );
    }

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
