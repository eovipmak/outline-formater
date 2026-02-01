# 📝 Outline Markdown Formatter

> Convert Outline exports into self-contained Markdown files with embedded images

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/eovipmak/outline-formater)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

🔒 **100% Private** - Processing happens on your server, files never leave your infrastructure  
⚡ **Fast & Simple** - Single-step: Upload ZIP → Get Markdown with embedded images  
✏️ **Editable** - Review and modify output before downloading  
🖼️ **Multi-Format** - Supports PNG, JPG, GIF, SVG, WebP, BMP, ICO  
📏 **Dimension Support** - Preserves image dimensions from Outline exports (e.g., `" =856x502"`)  
🚀 **Optimized API** - One endpoint for upload and download in a single request  
🇻🇳 **Vietnamese Filename** - Auto-generates Vietnamese slug filenames (e.g., `huong-dan-mau.md`)  
🔍 **Flexible Image Search** - Finds images anywhere in the ZIP structure, not just in specific folders

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Start production server
npm start
```

Then open [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Export** from Outline (downloads as `.zip`)
2. **Upload** your ZIP file to the app
3. **Review** the converted Markdown with embedded images
4. **Download** your self-contained file

## 📦 ZIP Structure Support

The app automatically finds and embeds images from **any folder structure** within the ZIP file. Common structures include:

```
your-document.zip
├── document.md
└── attachments/
    ├── image1.png
    └── image2.jpg
```

```
your-document.zip
├── document.md
├── files/
│   └── image1.png
└── random-folder/
    └── image2.jpg
```

```
your-document.zip
├── document.md
├── image1.png  (same level as .md)
└── subfolder/
    └── image2.jpg
```

**Note:** The output filename will be automatically converted to Vietnamese slug format (e.g., `huong-dan-mau.md`).

## 🛠️ How It Works

1. Upload ZIP via single API endpoint (`/api/download`)
2. Extracts ZIP and locates `.md` file on server
3. **Collects all images from any folder structure in the ZIP**
4. Converts images to base64 data URIs
5. **Generates Vietnamese slug filename** (e.g., `huong-dan-mau.md`)
6. Returns converted markdown file directly for download

**Tech Stack:** Next.js 14 • React 18 • JSZip • App Router

## ⚠️ Error Handling

- ❌ Invalid ZIP format
- ❌ No `.md` file found
- ❌ Multiple `.md` files (only one allowed)
- ❌ Missing referenced images
- ⚠️ Large images (>5MB) warning

## 🔌 API Endpoint

### POST /api/download
Upload ZIP file and download converted markdown in a single request.

**Request:**
- Content-Type: multipart/form-data
- Body: file (ZIP containing .md and attachments/)

**Response:**
- Content-Type: text/markdown
- Content-Disposition: attachment; filename="huong-dan-mau.md" (Vietnamese slug format)
- Body: Converted markdown with embedded images

**Example:**
```bash
curl -X POST http://localhost:3000/api/download \
  -F "file=@outline-export.zip" \
  -o converted.md
```

This single command uploads the ZIP and downloads the converted MD file immediately.

## 📝 Notes

- Base64 encoding increases file size by ~33%
- Processing happens server-side for better reliability
- Large files may take longer to process

## � Image Dimension Handling

### Supported Formats
The tool now handles Outline-exported images with dimension specifications:

- **Standard format**: `![alt](path)`
- **With dimensions**: `![alt](path " =widthxheight")`
- **Various spacing**: `![](path "=widthxheight")`
- **Empty alt text**: `![](path " =640x480")`

### Example
Outline exports like this:
```markdown
![](/api/attachments.redirect?id=acb3c249-a0ad-4511-a852-5c9408b585a3 " =856x502")
```

Are converted to:
```markdown
![](data:image/png;base64,iVBORw0KG... " =856x502")
```

**Dimensions are preserved** in the output, ensuring your images maintain the correct size.

## �📄 License

MIT License - see [LICENSE](LICENSE) file

## 🚀 Deployment

Deploy to Vercel with zero configuration:

```bash
npm run build
vercel --prod
```

Or use the Vercel button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/eovipmak/outline-formater)

---

**v3.0** | Made with ❤️ | Powered by Next.js
