'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/lib/AuthContext'

export default function PricingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  
  const handleSubscribe = async (planType) => {
    if (!user) {
      // 未登录用户跳转到登录页
      window.location.href = '/auth'
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          planType
        })
      })
      
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || '创建订阅失败')
      }
    } catch (error) {
      console.error('订阅失败:', error)
      alert('订阅失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }
  const plans = [
    {
      name: '免费版',
      price: '$0',
      period: '永久免费',
      description: '适合个人学习和小型项目',
      features: [
        '创建 3 个项目',
        '发布 3 篇博客',
        '基础项目管理',
        '基础博客编辑器',
        '社区支持'
      ],
      limitations: [
        '项目数量限制',
        '博客数量限制'
      ],
      buttonText: '开始使用',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    {
      name: '会员版',
      price: '$9.9',
      period: '每月',
      yearlyPrice: '$99',
      yearlyPeriod: '每年',
      description: '适合专业开发者和内容创作者',
      features: [
        '无限制创建项目',
        '无限制发布博客',
        '高级项目管理功能',
        '高级博客编辑器',
        '优先技术支持',
        '数据导出功能',
        '自定义域名支持',
        '高级分析统计'
      ],
      limitations: [],
      buttonText: '立即升级',
      buttonStyle: 'bg-blue-600 hover:bg-blue-700',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">选择适合你的方案</h1>
            <p className="text-xl text-gray-600 mb-8">
              从免费开始，随时升级到会员版解锁更多功能
            </p>
            <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setSelectedPlan('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedPlan === 'monthly' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                月付
              </button>
              <button 
                onClick={() => setSelectedPlan('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedPlan === 'yearly' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                年付 (省 17%)
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      推荐方案
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  
                  {plan.yearlyPrice && (
                    <div className="text-sm text-gray-500">
                      年付仅需 <span className="font-semibold text-green-600">{plan.yearlyPrice}</span> / 年
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-green-600">✅ 包含功能</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-4 text-orange-600">⚠️ 限制</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-center">
                            <svg className="w-5 h-5 text-orange-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (plan.name === '免费版') {
                      // 免费版跳转到注册页
                      window.location.href = user ? '/dashboard' : '/auth'
                    } else {
                      // 会员版开始订阅
                      handleSubscribe(selectedPlan)
                    }
                  }}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors disabled:opacity-50 ${plan.buttonStyle}`}
                >
                  {loading && plan.name === '会员版' ? '处理中...' : plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">常见问题</h2>
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2">可以随时取消订阅吗？</h3>
                <p className="text-gray-600">
                  是的，您可以随时取消订阅。取消后，您的会员权益将在当前计费周期结束时停止。
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2">免费版的限制是永久的吗？</h3>
                <p className="text-gray-600">
                  免费版允许您创建最多 3 个项目和 3 篇博客。如需更多，可随时升级到会员版。
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2">年付方案有什么优势？</h3>
                <p className="text-gray-600">
                  年付方案相比月付可节省 17%，相当于免费获得 2 个月的会员服务。
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-2">支持哪些支付方式？</h3>
                <p className="text-gray-600">
                  我们支持信用卡、支付宝、微信支付等多种支付方式，安全便捷。
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center bg-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">准备开始了吗？</h2>
            <p className="text-xl mb-8 opacity-90">
              加入数千名开发者，开始构建你的项目和分享你的想法
            </p>
            <div className="space-x-4">
              <Link href="/auth" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                免费开始
              </Link>
              <Link href="/pay" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                立即升级
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
