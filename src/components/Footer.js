export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">枞哥全栈开发</h3>
            <p className="text-gray-400">
              30天全栈开发学习之旅<br/>
              从产品经理到独立开发者
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">学习进度</h4>
            <ul className="space-y-2 text-gray-400">
              <li>• Day 1: 环境搭建 ✅</li>
              <li>• Day 2: Next.js路由 🔄</li>
              <li>• Day 3-7: 组件开发</li>
              <li>• Day 8-14: 数据库集成</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">联系方式</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Email
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} 枞哥全栈开发之旅. 保持学习，持续成长.</p>
        </div>
      </div>
    </footer>
  )
}