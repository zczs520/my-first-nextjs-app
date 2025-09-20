import Link from 'next/link'

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
        <div className="text-3xl mb-2">{project.icon}</div>
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-blue-100 text-sm">{project.category}</p>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech) => (
            <span key={tech} className="bg-gray-100 px-2 py-1 rounded text-sm">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded text-sm ${
            project.status === '已完成' ? 'bg-green-100 text-green-700' :
            project.status === '进行中' ? 'bg-yellow-100 text-yellow-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {project.status}
          </span>
          
          {project.link && (
            <Link 
              href={project.link}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              查看项目 →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
