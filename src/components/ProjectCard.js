'use client'
import Link from 'next/link'

// status 枚举映射到中文标签与颜色
const STATUS_NAME = {
  planned: '规划中',
  in_progress: '进行中',
  completed: '已完成',
  on_hold: '暂停',
}

const STATUS_BADGE = {
  planned: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  on_hold: 'bg-yellow-100 text-yellow-700',
}

export default function ProjectCard({ project, isManagementMode = false, onStatusChange, onDelete }) {
  const {
    title,
    description,
    category,
    tech_stack = [],
    status = 'planned',
    github_url,
    demo_url,
    image_url,
  } = project || {}

  const primaryLink = demo_url || github_url || ''

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    if (onStatusChange) {
      await onStatusChange(project.id, newStatus)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* 头图区 */}
      <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-end p-5 text-white" style={{backgroundImage: image_url ? `url(${image_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-blue-100 text-sm">{category}</p>
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-5">
        {description && <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>}

        {!!tech_stack?.length && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tech_stack.map((tech) => (
              <span key={tech} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded text-sm ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-700'}`}>
            {STATUS_NAME[status] || status}
          </span>

          {primaryLink && (
            <Link href={primaryLink} className="text-blue-600 hover:text-blue-800 font-medium" target="_blank">
              查看项目 →
            </Link>
          )}
        </div>

        {isManagementMode && (
          <div className="mt-4 flex items-center justify-between">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="planned">规划中</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="on_hold">暂停</option>
            </select>

            {onDelete && (
              <button
                onClick={() => onDelete(project.id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                删除
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
