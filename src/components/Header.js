'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  const navigation = [
    { name: '首页', href: '/' },
    { name: '关于', href: '/about' },
    { name: '项目', href: '/projects' },
    { name: '博客', href: '/blog' },
    { name: '会员', href: '/pricing' },
    { name: '联系', href: '/contact' },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            枞哥全栈开发 🚀
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 右侧登录状态（桌面端） */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <Link
                href="/auth"
                className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                登录
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  仪表盘
                </Link>
                <span className="text-sm text-gray-700">
                  已登录：{user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  退出登录
                </button>
              </div>
            )}
          </div>
          
          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <span className={`block h-0.5 bg-gray-600 transition-transform ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`} />
              <span className={`block h-0.5 bg-gray-600 transition-opacity ${
                isMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`block h-0.5 bg-gray-600 transition-transform ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`} />
            </div>
          </button>
        </div>
        
        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* 移动端登录状态 */}
            <div className="mt-2 pt-2 border-t">
              {!user ? (
                <Link
                  href="/auth"
                  className="block py-2 text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  去登录 →
                </Link>
              ) : (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 truncate max-w-[70%]">
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-700 underline">
                      仪表盘
                    </Link>
                    <span className="text-sm text-gray-700 truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleSignOut() }}
                    className="text-red-600"
                  >
                    退出
                  </button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
