// 创建临时测试页面 src/app/test-env/page.js
export default function TestEnv() {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">环境变量测试</h1>
        <div className="space-y-2">
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置'}</p>
          <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置'}</p>
          <p>当前环境: {process.env.NODE_ENV}</p>
        </div>
      </div>
    )
  }