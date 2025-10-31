'use client'

import { useState } from 'react';

export default function Home() {
  const [finalMarkdown, setFinalMarkdown] = useState('');
  const [originalFilename, setOriginalFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Xử lý khi người dùng chọn file
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset state
    setError('');
    setFinalMarkdown('');
    setOriginalFilename('');
    setLoading(true);

    try {
      // Validate file type
      if (!file.name.endsWith('.zip')) {
        throw new Error('Please upload a .zip file');
      }

      // Create FormData and upload to API
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/download', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process ZIP file');
      }

      // Read the markdown content from the response
      const markdownContent = await response.text();
      
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'converted.md';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      setFinalMarkdown(markdownContent);
      setOriginalFilename(filename);
    } catch (err) {
      setError(err.message || 'An error occurred while processing the file');
      console.error('Error processing ZIP:', err);
    } finally {
      setLoading(false);
      // Reset input value để cho phép upload lại file (kể cả file giống tên)
      event.target.value = '';
    }
  };

  // Xử lý download file markdown
  const handleDownload = () => {
    if (!finalMarkdown) return;

    try {
      // Create blob from markdown content
      const blob = new Blob([finalMarkdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);

      // Tạo temporary anchor để trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = originalFilename || 'output.md';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'An error occurred while downloading the file');
      console.error('Error downloading file:', err);
    }
  };

  // Xử lý khi user edit textarea
  const handleTextareaChange = (event) => {
    setFinalMarkdown(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Markdown Image Embed Tool</h1>
        <p className="subtitle">Convert Outline exports to self-contained Markdown with embedded images</p>
      </header>

      <main className="App-main">
        {/* File Upload Section */}
        <section className="upload-section">
          <label htmlFor="zip-upload" className="upload-label">
            <div className="upload-box">
              <div className="upload-icon">📦</div>
              <div className="upload-text">
                <strong>Choose a ZIP file</strong>
                <span>or drag and drop here</span>
              </div>
              <input
                id="zip-upload"
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
          </label>
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Processing ZIP file...</p>
            </div>
          )}
        </section>

        {/* Error Display */}
        {error && (
          <section className="error-section">
            <div className="error-banner">
              <strong>❌ Error:</strong>
              <pre>{error}</pre>
            </div>
          </section>
        )}

        {/* Output Section */}
        {finalMarkdown && (
          <section className="output-section">
            <div className="output-header">
              <h2>✅ Output Markdown</h2>
              <button onClick={handleDownload} className="download-button">
                ⬇️ Download {originalFilename}
              </button>
            </div>
            
            <textarea
              className="markdown-output"
              value={finalMarkdown}
              onChange={handleTextareaChange}
              placeholder="Your markdown with embedded images will appear here..."
              spellCheck="false"
            />
            
            <div className="output-info">
              <p>
                ℹ️ You can edit the content above. Images are embedded as base64 data URIs.
              </p>
            </div>
          </section>
        )}

        {/* Instructions */}
        {!finalMarkdown && !loading && !error && (
          <section className="instructions">
            <h3>How to use:</h3>
            <ol>
              <li>Export your document from Outline (it will be a .zip file)</li>
              <li>Upload the .zip file using the button above</li>
              <li>Wait for processing (images will be embedded as base64)</li>
              <li>Review, edit if needed, and download the result</li>
            </ol>
            <p className="note">
              <strong>Note:</strong> The ZIP should contain one .md file and an attachments/ folder with images.
            </p>
          </section>
        )}
      </main>

      <footer className="App-footer">
        <p>Built by <strong>tintn</strong> — powered by <a href="https://vinahost.vn" target="_blank" rel="noreferrer">[Vinahost]</a></p>
      </footer>
    </div>
  );
}
