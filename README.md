# 📝 Markdown Image Embed Tool# Getting Started with Create React App



A simple React web application that converts Outline exports into self-contained Markdown files with embedded images.This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



## ✨ Features## Available Scripts



- **100% Client-Side**: No backend, no external APIs - everything runs in your browserIn the project directory, you can run:

- **Privacy-Focused**: Your files never leave your computer

- **Simple Workflow**: Upload ZIP → Get Markdown with embedded images### `npm start`

- **Editable Output**: Review and edit the result before downloading

- **Multiple Image Formats**: Supports PNG, JPG/JPEG, GIF, SVG, WebP, BMP, and ICORuns the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🚀 Quick Start

The page will reload when you make changes.\

### DevelopmentYou may also see any lint errors in the console.



1. **Install dependencies**:### `npm test`

   ```bash

   npm installLaunches the test runner in the interactive watch mode.\

   ```See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



2. **Start the development server**:### `npm run build`

   ```bash

   npm startBuilds the app for production to the `build` folder.\

   ```It correctly bundles React in production mode and optimizes the build for the best performance.



3. **Open your browser** at `http://localhost:3000`The build is minified and the filenames include the hashes.\

Your app is ready to be deployed!

### Production Build

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

```bash

npm run build### `npm run eject`

```

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

The optimized production build will be in the `build/` folder, ready to deploy to any static hosting service.

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## 📖 How to Use

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

1. **Export from Outline**: Export your document from Outline - it will download as a `.zip` file

2. **Upload the ZIP**: Click the upload area or drag-and-drop your `.zip` fileYou don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

3. **Wait for Processing**: The app will extract the Markdown file and convert all images to base64

4. **Review & Edit**: The output appears in an editable textarea - make any changes if needed## Learn More

5. **Download**: Click the download button to save your self-contained Markdown file

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

## 📦 ZIP Structure

To learn React, check out the [React documentation](https://reactjs.org/).

The uploaded ZIP should have this structure (standard Outline export):

### Code Splitting

```

your-document.zipThis section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

├── document.md          # Your main markdown file

└── attachments/         # Folder containing images### Analyzing the Bundle Size

    ├── image1.png

    ├── image2.jpgThis section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

    └── subfolder/

        └── image3.gif### Making a Progressive Web App

```

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

## 🛠️ Technical Details

### Advanced Configuration

### Technologies Used

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

- **React**: UI framework

- **JSZip**: ZIP file processing in the browser### Deployment

- **Create React App**: Project setup and build tools

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### How It Works

### `npm run build` fails to minify

1. Reads the uploaded ZIP file using JSZip

2. Locates the single `.md` file (reports error if multiple or none found)This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

3. Collects all images from the `attachments/` folder
4. Finds all image references in the Markdown using regex patterns
5. Converts each image to base64 data URI
6. Replaces image URLs with their corresponding data URIs
7. Outputs a single Markdown file with all images embedded

### Error Handling

The app handles various error cases:

- ❌ No `.md` file found in ZIP
- ❌ Multiple `.md` files found (only one allowed)
- ❌ Referenced images missing from ZIP
- ❌ Invalid file format (not a ZIP)
- ❌ Unknown image format
- ⚠️  Large images (> 5MB) trigger console warnings

## 🎯 Use Cases

- **Backup**: Create portable Markdown files that don't depend on external image links
- **Sharing**: Share documents with embedded images via email or messaging
- **Archiving**: Store documents as single self-contained files
- **Offline Access**: View Markdown files without needing the original attachments folder

## 📝 Notes

- Images are embedded as base64 data URIs, which increases file size (~33% larger than original)
- Very large ZIP files or many high-resolution images may take longer to process
- The app runs entirely in the browser - no data is sent to any server

## 🤝 Contributing

This is a minimal, production-ready implementation. Feel free to fork and extend with features like:

- Drag-and-drop support for the upload area
- Markdown preview with rendered images
- Batch processing for multiple ZIP files
- Progress indicators for large files
- Support for other Markdown export formats

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🙏 Credits

Built for Outline users who need self-contained Markdown exports.

---

**Made with ❤️ | No data leaves your browser**
