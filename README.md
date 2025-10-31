# 📝 Outline Markdown Formatter

> Convert Outline exports into self-contained Markdown files with embedded images

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/eovipmak/outline-formater)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

🔒 **100% Private** - Everything runs in your browser, no server uploads  
⚡ **Fast & Simple** - Upload ZIP → Get Markdown with embedded images  
✏️ **Editable** - Review and modify output before downloading  
🖼️ **Multi-Format** - Supports PNG, JPG, GIF, SVG, WebP, BMP, ICO  
📏 **Dimension Support** - Preserves image dimensions from Outline exports (e.g., `" =856x502"`)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development mode
npm start

# Production build
npm run build
```

Then open [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Export** from Outline (downloads as `.zip`)
2. **Upload** your ZIP file to the app
3. **Review** the converted Markdown with embedded images
4. **Download** your self-contained file

## 📦 Expected ZIP Structure

```
your-document.zip
├── document.md
└── attachments/
    ├── image1.png
    ├── image2.jpg
    └── subfolder/
        └── image3.gif
```

## 🛠️ How It Works

1. Extracts ZIP and locates `.md` file
2. Collects all images from `attachments/`
3. Converts images to base64 data URIs
4. Replaces image references in Markdown
5. Outputs single self-contained file

**Tech Stack:** React • JSZip • Create React App

## ⚠️ Error Handling

- ❌ Invalid ZIP format
- ❌ No `.md` file found
- ❌ Multiple `.md` files (only one allowed)
- ❌ Missing referenced images
- ⚠️ Large images (>5MB) warning

## 📝 Notes

- Base64 encoding increases file size by ~33%
- All processing happens client-side
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

---

**v2.0** | Made with ❤️ | No data leaves your browser
