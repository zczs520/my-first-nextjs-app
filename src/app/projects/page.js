import ProjectCard from '@/components/ProjectCard'

export const metadata = {
  title: '我的项目',
  description: '枞哥的全栈开发项目展示',
}

// 模拟项目数据（后期从数据库获取）
const projects = [
  {
    id: 1,
    title: '个人品牌网站',
    category: '全栈开发',
    description: '使用Next.js构建的响应式个人网站，包含博客、项目展示等功能。',
    tech: ['Next.js', 'Tailwind CSS', 'Vercel'],
    status: '进行中',
    icon: '🌐',
    link: '/'
  },
  {
    id: 2,
    title: '跨境电商工具',
    category: '工具开发',
    description: '基于TikTok Shop经验开发的选品分析和市场洞察工具。',
    tech: ['Next.js', 'Supabase', 'Charts.js'],
    status: '规划中',
    icon: '📊'
  },
  {
    id: 3,
    title: '产品经理工具箱',
    category: '效率工具',
    description: '整合常用的产品经理工具，包括用户故事生成、数据分析等。',
    tech: ['React', 'Node.js', 'MongoDB'],
    status: '规划中',
    icon: '🛠️'
  }
]

export default function Projects() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">我的项目 🚀</h1>
          <p className="text-xl text-gray-600">
            记录30天全栈开发学习的项目成果
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-blue-50 inline-block px-8 py-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-2">项目进度追踪</h2>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div>已完成</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">1</div>
                <div>进行中</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">2</div>
                <div>规划中</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
