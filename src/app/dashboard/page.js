'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/AuthContext'

export default function DashboardPage() {
  const { user, loading, initializing } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 等待认证初始化完成
    if (initializing) return
    
    // 认证检查
    if (!loading && !user) {
      console.log('用户未登录，跳转到登录页')
      router.push('/auth')
      return
    }
  }, [user, loading, initializing, router])

  // 显示加载状态
  if (initializing || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    )
  }

  // 如果没有用户且不在加载中，不渲染任何内容（会被重定向）
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          欢迎回来，{user.email}
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/dashboard/projects"
            className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold mb-2">项目管理</h2>
            <p className="text-gray-600">创建和管理你的学习项目，跟踪进度与成果。</p>
          </a>

          <a
            href="/blog"
            className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold mb-2">博客管理</h2>
            <p className="text-gray-600">创建和发布你的博客文章，分享学习心得。</p>
          </a>

          <a
            href="/dashboard/subscription"
            className="block bg-white rounded-xl shadow hover:shadow-md transition p-6 border-2 border-blue-200"
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-600">订阅管理</h2>
            <p className="text-gray-600">管理你的会员订阅，查看使用统计和自动续费设置。</p>
          </a>

          <a
            href="/dashboard/messages"
            className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold mb-2">消息中心</h2>
            <p className="text-gray-600">查看系统消息与提醒。</p>
          </a>

          <a
            href="/dashboard/podcasts"
            className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold mb-2">播客管理</h2>
            <p className="text-gray-600">上传与管理播客内容（预览版）。</p>
          </a>

          <a
            href="/pricing"
            className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold mb-2">升级会员</h2>
            <p className="text-blue-100">解锁无限制创建项目和博客，享受更多高级功能。</p>
          </a>
        </div>
      </div>
    </div>
  )
}
