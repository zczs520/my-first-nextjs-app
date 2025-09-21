'use client'
import { useState } from 'react'

export default function BlogEditor({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || '学习记录',
    tags: initialData?.tags?.join(', ') || '',
    status: initialData?.status || 'draft'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const submitFormData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      submitFormData.append(key, value)
    })

    const result = await onSubmit(submitFormData)
    
    if (result.success) {
      setMessage('操作成功！')
      if (!initialData) {
        // 如果是新建文章，清空表单
        setFormData({
          title: '',
          content: '',
          excerpt: '',
          category: '学习记录',
          tags: '',
          status: 'draft'
        })
      }
    } else {
      setMessage(result.error || '操作失败')
    }
    
    setLoading(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const categories = [
    '学习记录', '技术分享', '项目总结', '心得体会', 
    '工具推荐', '问题解决', '其他'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          文章标题 *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请输入文章标题"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            分类
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            标签 (用逗号分隔)
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="标签1, 标签2, 标签3"
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
          文章摘要
        </label>
        <textarea
          id="excerpt"
          rows="3"
          value={formData.excerpt}
          onChange={(e) => handleInputChange('excerpt', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="简要描述文章内容..."
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          文章内容 *
        </label>
        <textarea
          id="content"
          rows="20"
          required
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          placeholder="在这里写文章内容，支持Markdown格式..."
        />
        <p className="text-xs text-gray-500 mt-1">
          支持Markdown格式，预计阅读时间：{Math.ceil(formData.content.length / 1000)}分钟
        </p>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          发布状态
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="draft">草稿</option>
          <option value="published">发布</option>
        </select>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex justify-end space-x-4">
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
          {loading ? '保存中...' : (initialData ? '更新文章' : '创建文章')}
        </button>
      </div>
    </form>
  )
}
