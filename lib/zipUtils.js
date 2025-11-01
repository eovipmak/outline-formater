import JSZip from 'jszip';

/**
 * Xác định MIME type dựa trên extension của file
 */
function getMimeType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon'
  };
  return mimeTypes[ext] || null;
}

/**
 * Convert file binary data sang base64 data URI
 */
async function fileToBase64DataUri(file, filename) {
  const mimeType = getMimeType(filename);
  if (!mimeType) {
    throw new Error(`Unknown image format for file: ${filename}`);
  }
  
  // Đọc file dưới dạng base64
  const base64 = await file.async('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Tìm và đọc file .md trong ZIP
 * Trả về { content, filename } hoặc throw error
 */
async function findMarkdownFile(zip) {
  const mdFiles = [];
  
  // Tìm tất cả file .md trong ZIP
  zip.forEach((relativePath, file) => {
    if (!file.dir && relativePath.endsWith('.md')) {
      mdFiles.push({ path: relativePath, file });
    }
  });
  
  if (mdFiles.length === 0) {
    throw new Error('No .md file found in ZIP. Please upload a valid Outline export.');
  }
  
  if (mdFiles.length > 1) {
    throw new Error(`Found ${mdFiles.length} .md files in ZIP. Please upload a ZIP with only one .md file.`);
  }
  
  const mdFile = mdFiles[0];
  const content = await mdFile.file.async('string');
  const filename = mdFile.path.split('/').pop(); // Lấy tên file
  
  return { content, filename };
}

/**
 * Thu thập tất cả các file ảnh từ thư mục attachments/ hoặc files/
 * Hỗ trợ cả Outline exports (attachments/) và Docmost exports (files/)
 * Trả về Map: path -> file object
 */
function collectAttachments(zip) {
  const attachments = new Map();
  
  zip.forEach((relativePath, file) => {
    // Chỉ lấy file (không phải thư mục) trong attachments/ hoặc files/
    if (!file.dir && (relativePath.includes('attachments/') || relativePath.includes('files/'))) {
      // Normalize path: loại bỏ leading slash nếu có
      const normalizedPath = relativePath.startsWith('/') 
        ? relativePath.substring(1) 
        : relativePath;
      
      // Lưu với path đầy đủ
      attachments.set(normalizedPath, file);
      
      // Thêm các biến thể path để dễ match
      // Đối với attachments/
      if (relativePath.includes('attachments/')) {
        const withoutPrefix = relativePath.split('attachments/')[1];
        if (withoutPrefix) {
          attachments.set(`attachments/${withoutPrefix}`, file);
          attachments.set(withoutPrefix, file);
        }
      }
      
      // Đối với files/ (Docmost format)
      if (relativePath.includes('files/')) {
        const withoutPrefix = relativePath.split('files/')[1];
        if (withoutPrefix) {
          attachments.set(`files/${withoutPrefix}`, file);
          attachments.set(withoutPrefix, file);
        }
      }
    }
  });
  
  return attachments;
}

/**
 * Tìm tất cả các tham chiếu ảnh trong Markdown
 * Hỗ trợ: ![alt](path), ![](path), và các reference style images
 * Cũng hỗ trợ: ![alt](path "title =widthxheight") - Outline format với dimensions
 * Hỗ trợ cả files/ prefix từ Docmost
 */
function findImageReferences(markdown) {
  const references = [];
  
  // Pattern 1: ![alt](path) hoặc ![](path)
  // Cũng match pattern với dimensions: ![alt](path " =widthxheight")
  const inlinePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = inlinePattern.exec(markdown)) !== null) {
    const fullPath = match[2];
    let path = fullPath;
    let dimensions = null;
    
    // Kiểm tra xem có dimensions không (format: " =widthxheight")
    const dimensionMatch = fullPath.match(/^(.+?)\s+"?\s*=(\d+)x(\d+)"?$/);
    if (dimensionMatch) {
      path = dimensionMatch[1].trim();
      dimensions = {
        width: dimensionMatch[2],
        height: dimensionMatch[3]
      };
    }
    
    // Lấy các path trỏ đến attachments/ hoặc files/
    if (path.includes('attachments/') || path.includes('files/')) {
      references.push({
        fullMatch: match[0],
        alt: match[1],
        path: path,
        fullPath: fullPath,
        dimensions: dimensions,
        index: match.index
      });
    }
  }
  
  return references;
}

/**
 * Thay thế các URL ảnh trong Markdown bằng data URI
 */
async function replaceImageUrls(markdown, attachments) {
  const references = findImageReferences(markdown);
  const missingFiles = [];
  const replacements = [];
  
  // Process từng reference
  for (const ref of references) {
    const path = ref.path;
    
    // Thử tìm file với nhiều cách normalize path khác nhau
    let imageFile = attachments.get(path);
    
    if (!imageFile) {
      // Thử path không có leading slash
      const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
      imageFile = attachments.get(pathWithoutLeadingSlash);
    }
    
    if (!imageFile) {
      // Thử path có thêm prefix nếu chưa có (attachments/)
      const pathWithAttachmentsPrefix = path.startsWith('attachments/') ? path : `attachments/${path}`;
      imageFile = attachments.get(pathWithAttachmentsPrefix);
    }

    if (!imageFile) {
      // Thử path có thêm prefix files/ (Docmost format)
      const pathWithFilesPrefix = path.startsWith('files/') ? path : `files/${path}`;
      imageFile = attachments.get(pathWithFilesPrefix);
    }

    if (!imageFile) {
      // Thử chỉ lấy phần sau cùng của path (chỉ tên file)
      const filename = path.split('/').pop();
      imageFile = attachments.get(filename);
      if (imageFile) {
        console.warn(`Using filename-only fallback for: ${path} -> ${filename}`);
      }
    }
    
    if (imageFile) {
      try {
        // Convert sang data URI
        const dataUri = await fileToBase64DataUri(imageFile, path);
        
        // Check size warning (optional - chỉ log, không block)
        const fileSize = imageFile._data?.uncompressedSize || 0;
        if (fileSize > 5 * 1024 * 1024) { // > 5MB
          console.warn(`Large image detected: ${path} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
        }
        
        // Giữ nguyên dimensions nếu có
        let newImageUrl = dataUri;
        if (ref.dimensions) {
          newImageUrl = `${dataUri} " =${ref.dimensions.width}x${ref.dimensions.height}"`;
        }
        
        replacements.push({
          oldText: ref.fullMatch,
          newText: `![${ref.alt}](${newImageUrl})`
        });
      } catch (error) {
        missingFiles.push(`${path} (error: ${error.message})`);
      }
    } else {
      missingFiles.push(path);
    }
  }
  
  // Báo lỗi nếu có file missing
  if (missingFiles.length > 0) {
    throw new Error(
      `Missing image files (${missingFiles.length}):\n${missingFiles.map(f => `  - ${f}`).join('\n')}`
    );
  }
  
  // Thực hiện replace từ cuối lên đầu để không ảnh hưởng index
  let result = markdown;
  replacements.reverse().forEach(({ oldText, newText }) => {
    result = result.replace(oldText, newText);
  });
  
  return result;
}

/**
 * Main function: xử lý file ZIP và trả về Markdown đã nhúng ảnh
 * 
 * @param {File|ArrayBuffer|Blob} file - File ZIP data (can be File, ArrayBuffer, or Blob)
 * @returns {Promise<{finalMarkdown: string, originalMarkdownName: string}>}
 */
export async function processZip(file) {
  try {
    // 1. Load ZIP file
    const zip = await JSZip.loadAsync(file);
    
    // 2. Tìm file .md
    const { content: markdownContent, filename: markdownFilename } = await findMarkdownFile(zip);
    
    // 3. Thu thập tất cả attachments (hỗ trợ cả attachments/ và files/)
    const attachments = collectAttachments(zip);
    
    console.log(`Found ${attachments.size} attachment(s)`);
    
    // 4. Thay thế URLs bằng data URIs
    const finalMarkdown = await replaceImageUrls(markdownContent, attachments);
    
    return {
      finalMarkdown,
      originalMarkdownName: markdownFilename
    };
  } catch (error) {
    // Re-throw với message rõ ràng hơn
    if (error.message.includes('is not a valid zip file')) {
      throw new Error('Invalid ZIP file. Please upload a valid ZIP archive.');
    }
    throw error;
  }
}
