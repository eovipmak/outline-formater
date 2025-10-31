import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { markdown, filename } = body;

    if (!markdown) {
      return NextResponse.json(
        { error: 'No markdown content provided' },
        { status: 400 }
      );
    }

    // Create response with markdown content
    const response = new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${filename || 'output.md'}"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error creating download:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the download' },
      { status: 500 }
    );
  }
}
