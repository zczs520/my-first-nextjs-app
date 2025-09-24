'use client'
import Link from 'next/link'

export default function PayCancel() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">支付已取消 ❌</h1>
        <p className="text-gray-600 mb-6">您已取消支付，可以重新尝试。</p>
        <div className="space-x-4">
          <Link href="/pay" className="text-blue-600 underline">重新支付</Link>
          <Link href="/" className="text-blue-600 underline">返回首页</Link>
        </div>
      </div>
    </div>
  )
}
