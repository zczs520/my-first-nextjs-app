import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AuthProvider } from '../lib/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: {
    default: '枞哥的全栈开发之旅',
    template: '%s | 枞哥的全栈开发之旅'
  },
  description: '30天从产品经理转全栈开发者的学习记录',
  keywords: '全栈开发,Next.js,React,产品经理,跨境电商',
  authors: [{ name: '枞哥' }],
  creator: '枞哥',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <AuthProvider>
              {children}
            </AuthProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
