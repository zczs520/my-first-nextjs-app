'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../lib/AuthContext'
import { supabase } from '../../../lib/supabase'
import BlogEditor from '@/components/BlogEditor'

export default function PodcastsManagement() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }
    if (user) loadList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const loadList = async () => {
    setLoadingList(true)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', '播客')
      .order('created_at', { ascending: false })
    if (!error) setItems(data || [])
    setLoadingList(false)
  }

  const handleSubmit = async (formData) => {
    // BlogEditor 传入的是 FormData，转换字段
    const title = formData.get('title')?.toString().trim()
    const content = formData.get('content')?.toString() || ''
    const excerpt = formData.get('excerpt')?.toString() || ''
    const status = formData.get('status')?.toString() || 'draft'
    const tagsStr = formData.get('tags')?.toString() || ''
    const tags = tagsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    if (!title) return { success: false, error: '标题必填' }

    if (editing) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({
          title,
          content,
          excerpt,
          status,
          tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', editing.id)
        .eq('user_id', user.id)
        .select()

      if (error) return { success: false, error: error.message }
      setItems(prev => prev.map(p => (p.id === editing.id ? data[0] : p)))
      setEditing(null)
      setShowForm(false)
      return { success: true, data: data[0] }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        user_id: user.id,
        title,
        content,
        excerpt,
        category: '播客',
        tags,
        status
      }])
      .select()

    if (error) return { success: false, error: error.message }
    setItems(prev => [data[0], ...prev])
    setShowForm(false)
    return { success: true, data: data[0] }
  }

  const onEdit = (item) => {
    setEditing({ ...item, tags: item.tags || [] })
    setShowForm(true)
  }

  const onDelete = async (id) => {
    if (!confirm('确定要删除这条播客文章吗？')) return
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (!error) setItems(prev => prev.filter(p => p.id !== id))
  }

  const initialFormData = useMemo(() => {
    if (!editing) return null
    return {
      title: editing.title,
      content: editing.content,
      excerpt: editing.excerpt,
      category: '播客',
      tags: (editing.tags || []).join(', '),
      status: editing.status || 'draft'
    }
  }, [editing])

  if (loading || loadingList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">播客管理</h1>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/projects"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              返回项目
            </a>
            <button
              onClick={() => { setEditing(null); setShowForm(true) }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 新建播客文章
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-5 flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-500 mt-1">状态：{item.status} · 发布于 {new Date(item.created_at).toLocaleString()}</div>
                {!!(item.tags && item.tags.length) && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map(t => (
                      <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">#{t}</span>
                    ))}
                  </div>
                )}
                {item.excerpt && (
                  <p className="text-gray-700 mt-2 line-clamp-2">{item.excerpt}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(item)} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">编辑</button>
                <button onClick={() => onDelete(item.id)} className="px-3 py-1.5 text-sm border rounded text-red-600 hover:bg-red-50">删除</button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <div className="text-gray-500">还没有播客文章，点击右上角“新建播客文章”开始吧</div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="text-lg font-semibold">{editing ? '编辑播客文章' : '新建播客文章'}</div>
                <button onClick={() => setShowForm(false)} className="p-1 text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="p-6">
                <BlogEditor
                  initialData={initialFormData}
                  onSubmit={handleSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
