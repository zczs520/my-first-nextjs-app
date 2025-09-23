export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">仪表盘</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a
            href="/dashboard/projects"
            className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold mb-2">项目管理</h2>
            <p className="text-gray-600">创建和管理你的学习项目，跟踪进度与成果。</p>
          </a>

          <a
            href="/dashboard/messages"
            className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold mb-2">消息中心</h2>
            <p className="text-gray-600">查看系统消息与提醒。</p>
          </a>

          <a
            href="/dashboard/podcasts"
            className="block bg-white rounded-xl shadow hover:shadow-md transition p-6"
          >
            <h2 className="text-xl font-semibold mb-2">播客管理</h2>
            <p className="text-gray-600">上传与管理播客内容（预览版）。</p>
          </a>
        </div>
      </div>
    </div>
  )
}
