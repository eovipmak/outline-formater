import './globals.css'

export const metadata = {
  title: '📝 Outline Markdown Formatter',
  description: 'Convert Outline exports into self-contained Markdown files with embedded images',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
