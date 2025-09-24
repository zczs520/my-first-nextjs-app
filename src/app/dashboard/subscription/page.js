'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../lib/AuthContext'
import { getUserSubscription } from '@/lib/subscription'

export default function SubscriptionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [subscription, setSubscription] = useState(null)
  const [loadingSubscription, setLoadingSubscription] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
      return
    }
    if (user) {
      loadSubscription()
    }
  }, [user, loading, router])

  const loadSubscription = async () => {
    setLoadingSubscription(true)
    try {
      const subData = await getUserSubscription(user.id)
      setSubscription(subData)
    } catch (error) {
      console.error('获取订阅信息失败:', error)
    } finally {
      setLoadingSubscription(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      // 创建 Stripe 客户门户会话
      const response = await fetch('/api/subscription/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      })
      
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('无法打开订阅管理页面，请稍后重试')
      }
    } catch (error) {
      console.error('打开订阅管理失败:', error)
      alert('操作失败，请稍后重试')
    }
  }

  if (loading || loadingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isActive = subscription?.subscription_tier === 'premium' && 
                   subscription?.subscription_status === 'active'
  const isPastDue = subscription?.subscription_status === 'past_due'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">订阅管理</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">当前订阅状态</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">订阅等级：</span>
                  <span className={`font-medium ${
                    subscription?.subscription_tier === 'premium' 
                      ? 'text-blue-600' 
                      : 'text-gray-600'
                  }`}>
                    {subscription?.subscription_tier === 'premium' ? '会员版' : '免费版'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">状态：</span>
                  <span className={`font-medium ${
                    isActive ? 'text-green-600' : 
                    isPastDue ? 'text-orange-600' : 
                    'text-gray-600'
                  }`}>
                    {isActive ? '活跃' : 
                     isPastDue ? '逾期' : 
                     subscription?.subscription_status === 'canceled' ? '已取消' : '未激活'}
                  </span>
                </div>

                {subscription?.subscription_end_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {isActive ? '下次续费：' : '到期时间：'}
                    </span>
                    <span className="font-medium">
                      {new Date(subscription.subscription_end_date).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {isActive && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">自动续费已启用</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    您的订阅将在到期前自动续费，无需手动操作
                  </p>
                </div>
              )}

              {isPastDue && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-orange-800 font-medium">续费失败</span>
                  </div>
                  <p className="text-orange-700 text-sm mt-1">
                    请更新您的支付方式以恢复服务
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">订阅操作</h2>
          
          <div className="space-y-4">
            {subscription?.subscription_tier === 'premium' ? (
              <button
                onClick={handleManageSubscription}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                管理订阅
              </button>
            ) : (
              <a
                href="/pricing"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                升级到会员版
              </a>
            )}
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 通过"管理订阅"可以：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>更新支付方式</li>
                <li>查看账单历史</li>
                <li>取消自动续费</li>
                <li>下载发票</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">使用统计</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {subscription?.subscription_tier === 'premium' ? '∞' : '3'}
              </div>
              <div className="text-gray-600">项目限制</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {subscription?.subscription_tier === 'premium' ? '∞' : '3'}
              </div>
              <div className="text-gray-600">博客限制</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
