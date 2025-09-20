export const metadata = {
    title: '关于我 - 枞哥的全栈开发之旅',
    description: '产品经理转全栈开发者的学习历程',
  }
  
  export default function About() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
              关于枞哥 👋
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-blue-600">
                  🎯 职业背景
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li>• 产品经理 - 擅长数据分析和商业洞察</li>
                  <li>• TikTok东南亚小店店主 - 跨境电商实战经验</li>
                  <li>• 独立开发者初学者 - 正在转型全栈</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-green-600">
                  🚀 技能栈
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">产品设计</span>
                  <span className="bg-green-100 px-3 py-1 rounded-full text-sm">数据分析</span>
                  <span className="bg-purple-100 px-3 py-1 rounded-full text-sm">跨境电商</span>
                  <span className="bg-yellow-100 px-3 py-1 rounded-full text-sm">HTML/CSS/JS</span>
                  <span className="bg-red-100 px-3 py-1 rounded-full text-sm">Next.js学习中</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                🎯 30天全栈开发目标
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-2">📱</div>
                  <h3 className="font-semibold">Week 1-2</h3>
                  <p className="text-sm text-gray-600">掌握Next.js + 用户系统</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-2">🛠️</div>
                  <h3 className="font-semibold">Week 3</h3>
                  <p className="text-sm text-gray-600">开发工具产品</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="font-semibold">Week 4</h3>
                  <p className="text-sm text-gray-600">集成支付 + 变现</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  