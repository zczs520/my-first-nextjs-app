export const metadata = {
    title: '学习博客',
    description: '30天全栈开发学习记录和心得分享',
  }
  
  // 模拟博客文章数据
  const blogPosts = [
    {
      id: 1,
      title: 'Day 1: 从零开始的Next.js之旅',
      excerpt: '记录第一天学习Next.js的心得体会，从环境搭建到第一个应用上线的完整过程。',
      date: '2024-09-18',
      category: '学习记录',
      readTime: '5 分钟',
      tags: ['Next.js', '环境搭建', 'Vercel']
    },
    {
      id: 2,
      title: 'Day 2: 路由系统和组件化思维',
      excerpt: '深入理解Next.js的App Router，学习组件化开发思想，构建可复用的UI组件。',
      date: '2024-09-19',
      category: '学习记录',
      readTime: '8 分钟',
      tags: ['路由', '组件', 'React']
    },
    {
      id: 3,
      title: '产品经理转开发者的思维转换',
      excerpt: '分享从产品思维到开发思维的转变过程，以及如何将产品经验应用到技术学习中。',
      date: '2024-09-20',
      category: '心得体会',
      readTime: '6 分钟',
      tags: ['产品经理', '开发者', '思维转换']
    }
  ]
  
  export default function Blog() {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">学习博客 📝</h1>
              <p className="text-xl text-gray-600">
                记录30天全栈开发学习的点点滴滴
              </p>
            </div>
            
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="border-b border-gray-200 pb-8">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 hover:text-blue-600">
                    <a href={`/blog/${post.id}`}>{post.title}</a>
                  </h2>
                  
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <a 
                    href={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    阅读全文 →
                  </a>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">学习统计</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">30</div>
                    <div className="text-gray-600">天学习计划</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">2</div>
                    <div className="text-gray-600">已完成天数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">3</div>
                    <div className="text-gray-600">发布文章</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  