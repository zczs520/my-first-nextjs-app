import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          枞哥的全栈开发之旅
        </h1>
        <p className="text-xl mb-8">
          Day 1: 我的第一个Next.js应用
        </p>
        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">今天的目标</h2>
          <ul className="text-left">
            <li>✅ 搭建开发环境</li>
            <li>✅ 创建Next.js项目</li>
            <li>🚀 部署到Vercel</li>
            <li>🌐 绑定自定义域名</li>
          </ul>
        </div>
      </div>
    </main>
  )
} 




