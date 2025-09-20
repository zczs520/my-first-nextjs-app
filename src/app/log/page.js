export default function LearningLog() {
    const days = [
      {
        day: 1,
        title: "环境搭建和首次部署",
        status: "completed",
        achievements: [
          "搭建Next.js开发环境",
          "部署到Vercel并绑定域名",
          "理解现代全栈开发工作流"
        ],
        tech: ["Next.js", "Vercel", "Git", "域名配置"]
      },
      {
        day: 2,
        title: "路由系统和组件开发",
        status: "completed",
        achievements: [
          "掌握Next.js App Router路由系统",
          "学会React组件化开发",
          "实现Server Actions处理表单",
          "构建完整的多页面网站"
        ],
        tech: ["App Router", "React组件", "Server Actions", "表单处理"]
      },
      {
        day: 3,
        title: "数据库集成计划",
        status: "planned",
        achievements: [
          "学习Supabase数据库",
          "实现用户注册登录",
          "数据存储和查询"
        ],
        tech: ["Supabase", "数据库设计", "用户认证"]
      }
    ]
  
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">30天全栈开发学习日志</h1>
        
        <div className="space-y-6">
          {days.map((dayData) => (
            <div key={dayData.day} className={`border-l-4 p-6 rounded-r-lg ${
              dayData.status === 'completed' ? 'bg-green-50 border-green-400' :
              dayData.status === 'current' ? 'bg-blue-50 border-blue-400' :
              'bg-gray-50 border-gray-300'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  Day {dayData.day}: {dayData.title}
                </h2>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  dayData.status === 'completed' ? 'bg-green-100 text-green-700' :
                  dayData.status === 'current' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {dayData.status === 'completed' ? '✅ 已完成' :
                   dayData.status === 'current' ? '🔄 进行中' : '📅 计划中'}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">学习成果:</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {dayData.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">技术栈:</h3>
                  <div className="flex flex-wrap gap-1">
                    {dayData.tech.map((tech, index) => (
                      <span key={index} className="bg-blue-100 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  