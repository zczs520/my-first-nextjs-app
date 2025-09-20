export default function EnvCheck() {
    // 安全获取环境变量
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">环境变量检查 🔍</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded">
              <div className="font-semibold">Supabase URL:</div>
              <div className="text-sm mt-1">
                {supabaseUrl ? (
                  <span className="text-green-600">✅ 已配置: {supabaseUrl}</span>
                ) : (
                  <span className="text-red-600">❌ 未配置</span>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gray-100 rounded">
              <div className="font-semibold">Supabase Key:</div>
              <div className="text-sm mt-1">
                {supabaseKey ? (
                  <span className="text-green-600">✅ 已配置: {supabaseKey.substring(0, 20)}...</span>
                ) : (
                  <span className="text-red-600">❌ 未配置</span>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-blue-100 rounded border-l-4 border-blue-500">
              <div className="font-semibold text-blue-800">状态总结:</div>
              <div className="text-blue-700 mt-1">
                {supabaseUrl && supabaseKey ? (
                  "✅ 环境变量配置正确！数据库应该可以连接。"
                ) : (
                  "❌ 环境变量配置不完整，需要检查Vercel设置。"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  