'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../lib/AuthContext'
import { supabase } from '../../../lib/supabase'
import ProjectForm from '@/components/ProjectForm'
import ProjectCard from '@/components/ProjectCard'

export default function ProjectsManagement() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }
    if (user) {
      loadProjects()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])

  const loadProjects = async () => {
    setLoadingProjects(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setProjects(data || [])
    setLoadingProjects(false)
  }

  const handleCreateProject = async (formData) => {
    const title = formData.get('title')
    const description = formData.get('description')
    const category = formData.get('category') || '其他'
    const techStack = formData.get('tech_stack')?.split(',').map(s => s.trim()).filter(Boolean) || []
    const githubUrl = formData.get('github_url')?.trim() || null
    const demoUrl = formData.get('demo_url')?.trim() || null

    if (!title) return { success: false, error: '项目标题是必填的' }

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: user.id,
          title: title.trim(),
          description: description?.trim() || '',
          category,
          tech_stack: techStack,
          github_url: githubUrl,
          demo_url: demoUrl,
          status: 'planned'
        }
      ])
      .select()

    if (error) {
      console.error('创建项目错误:', error)
      return { success: false, error: '创建项目失败，请稍后重试' }
    }

    setProjects(prev => [data[0], ...prev])
    setShowForm(false)
    return { success: true, data: data[0] }
  }

  const handleStatusChange = async (projectId, newStatus) => {
    const { data, error } = await supabase
      .from('projects')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .eq('user_id', user.id)
      .select()
    if (!error && data?.[0]) {
      setProjects(prev => prev.map(p => (p.id === projectId ? { ...p, status: newStatus } : p)))
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!confirm('确定要删除这个项目吗？')) return
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user.id)
    if (!error) {
      setProjects(prev => prev.filter(p => p.id !== projectId))
    }
  }

  if (loading || loadingProjects) {
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
          <h1 className="text-3xl font-bold text-gray-900">项目管理</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 创建新项目
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {['planned', 'in_progress', 'completed', 'on_hold'].map((status) => {
            const count = projects.filter(p => p.status === status).length
            const statusNames = {
              planned: '规划中',
              in_progress: '进行中',
              completed: '已完成',
              on_hold: '暂停'
            }
            const statusColors = {
              planned: 'bg-gray-100 text-gray-700',
              in_progress: 'bg-blue-100 text-blue-700',
              completed: 'bg-green-100 text-green-700',
              on_hold: 'bg-yellow-100 text-yellow-700'
            }

            return (
              <div key={status} className={`p-4 rounded-lg ${statusColors[status]}`}>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm">{statusNames[status]}</div>
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteProject}
              isManagementMode={true}
            />
          ))}

          {projects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">还没有项目</h3>
              <p className="text-gray-600 mb-4">创建你的第一个项目来开始记录学习成果</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                创建项目
              </button>
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">创建新项目</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <ProjectForm
                  onSubmit={handleCreateProject}
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
