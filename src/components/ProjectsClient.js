'use client'
import { useEffect, useState } from 'react'
import ProjectCard from '@/components/ProjectCard'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'

const defaultProjects = [
  { id: 'd1', title: '个人品牌网站', category: '全栈开发', description: '使用Next.js构建的响应式个人网站，包含博客、项目展示等功能。', tech_stack: ['Next.js', 'Tailwind', 'Vercel'], status: 'in_progress' },
  { id: 'd2', title: '跨境电商工具', category: '工具开发', description: '基于经验开发的选品分析和市场洞察工具。', tech_stack: ['Next.js', 'Supabase'], status: 'planned' },
  { id: 'd3', title: '产品经理工具箱', category: '效率工具', description: '整合常用的产品经理工具，包括用户故事生成、数据分析等。', tech_stack: ['React'], status: 'planned' },
]

export default function ProjectsClient() {
  const { user } = useAuth()
  const [items, setItems] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setItems(defaultProjects)
        return
      }
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) {
        setItems(defaultProjects)
      } else {
        setItems(data || [])
      }
    }
    load()
  }, [user])

  const isLoading = items === null

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">我的项目 🚀</h1>
          <p className="text-xl text-gray-600">记录30天全栈开发学习的项目成果</p>
        </div>
        {isLoading ? (
          <div className="text-center text-gray-500">加载中...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {items.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
