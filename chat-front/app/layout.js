import './globals.css'

export const metadata = {
  title: 'Dark Chat App',
  description: 'Real-time dark theme chat application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-dark-text">
        {children}
      </body>
    </html>
  )
}