'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'

const defaultPosts = [
  { id: 'b1', title: 'Day 1: 从零开始的Next.js之旅', excerpt: '记录第一天学习Next.js的心得体会，从环境搭建到第一个应用上线的完整过程。', category: '学习记录', read_time: 5, tags: ['Next.js', '环境搭建', 'Vercel'], created_at: '2024-09-18' },
  { id: 'b2', title: 'Day 2: 路由系统和组件化思维', excerpt: '深入理解Next.js的App Router，学习组件化开发思想，构建可复用的UI组件。', category: '学习记录', read_time: 8, tags: ['路由', '组件', 'React'], created_at: '2024-09-19' },
  { id: 'b3', title: '产品经理转开发者的思维转换', excerpt: '分享从产品思维到开发者的转变过程，以及如何将产品经验应用到技术学习中。', category: '心得体会', read_time: 6, tags: ['产品经理', '开发者', '思维转换'], created_at: '2024-09-20' },
]

export default function BlogClient() {
  const { user } = useAuth()
  const [items, setItems] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setItems(defaultPosts)
        return
      }
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, category, tags, read_time, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) {
        setItems(defaultPosts)
      } else {
        setItems(data || [])
      }
    }
    load()
  }, [user])

  const isLoading = items === null

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">学习博客 📝</h1>
            <p className="text-xl text-gray-600">记录30天全栈开发学习的点点滴滴</p>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-500">加载中...</div>
          ) : (
            <div className="space-y-8">
              {items.map((post) => (
                <article key={post.id} className="border-b border-gray-200 pb-8">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.read_time || 5} 分钟</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 hover:text-blue-600">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  {!!post.tags?.length && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">#{tag}</span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
