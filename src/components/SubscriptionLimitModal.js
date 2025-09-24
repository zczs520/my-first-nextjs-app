'use client'
import Link from 'next/link'

export default function SubscriptionLimitModal({ isOpen, onClose, resourceType, currentCount, limit }) {
  if (!isOpen) return null

  const resourceName = resourceType === 'project' ? '项目' : '博客'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c.77.833 1.732 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {resourceName}数量已达上限
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            免费版最多创建 {limit} 个{resourceName}，您已创建 {currentCount} 个。
            升级到会员版即可无限制创建{resourceName}！
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <Link
              href="/pricing"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 text-center"
            >
              立即升级
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
