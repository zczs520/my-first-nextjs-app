'use client'
import { useState } from 'react'

export default function ProjectForm({ onSubmit, onCancel, initialData = null }) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '其他',
    tech_stack: (initialData?.tech_stack || []).join(', '),
    github_url: initialData?.github_url || '',
    demo_url: initialData?.demo_url || ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))

    const result = await onSubmit(fd)
    if (result?.success) {
      setMessage('项目创建成功！')
      // 清空
      if (!initialData) {
        setForm({
          title: '',
          description: '',
          category: '其他',
          tech_stack: '',
          github_url: '',
          demo_url: ''
        })
      }
    } else {
      setMessage(result?.error || '操作失败，请稍后重试')
    }

    setLoading(false)
  }

  const categories = ['其他', '学习', 'Web', '后端', '全栈', '工具', '实验']

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">项目标题 *</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入项目标题"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">项目描述</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="项目的功能、目标或进展..."
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">技术栈（用逗号分隔）</label>
          <input
            type="text"
            value={form.tech_stack}
            onChange={(e) => handleChange('tech_stack', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例如：Next.js, Supabase, Tailwind"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub 链接</label>
          <input
            type="url"
            value={form.github_url}
            onChange={(e) => handleChange('github_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/xxx/yyy"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Demo 链接</label>
          <input
            type="url"
            value={form.demo_url}
            onChange={(e) => handleChange('demo_url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://demo.example.com"
          />
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '提交中...' : (initialData ? '更新项目' : '创建项目')}
        </button>
      </div>
    </form>
  )
}
