'use client'
import Link from 'next/link'

export default function PaySuccess() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">支付成功 ✅</h1>
        <p className="text-gray-600 mb-6">感谢你的支付，订单已完成。</p>
        <Link href="/" className="text-blue-600 underline">返回首页</Link>
      </div>
    </div>
  )
}
