'use client'
import { useState } from 'react'
import QRCodeLib from 'qrcode'

export default function PayPage() {
  const [amount, setAmount] = useState(990) // 分，默认 ¥9.90
  const [payUrl, setPayUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card') // 默认卡支付

  const createSession = async () => {
    setLoading(true)
    setError('')
    setPayUrl('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, paymentMethod }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '创建会话失败')
      
      // 微信支付和支付宝直接跳转，卡支付显示二维码
      if (paymentMethod === 'wechat_pay' || paymentMethod === 'alipay') {
        // 直接跳转到支付页面，简化用户体验
        window.location.href = data.url
      } else {
        // 卡支付显示二维码（因为通常在桌面端使用）
        const qrDataUrl = await QRCodeLib.toDataURL(data.url, { margin: 2, width: 220 })
        setPayUrl(qrDataUrl)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-xl">
        <h1 className="text-3xl font-bold mb-4">支付测试 💳</h1>
        <p className="text-gray-600 mb-6">支持卡支付、支付宝、微信支付。默认金额 ¥9.90，可修改。</p>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">支付方式</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`px-3 py-2 rounded text-sm border ${
                  paymentMethod === 'card' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                💳 卡支付
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('alipay')}
                className={`px-3 py-2 rounded text-sm border ${
                  paymentMethod === 'alipay' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                💰 支付宝
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('wechat_pay')}
                className={`px-3 py-2 rounded text-sm border ${
                  paymentMethod === 'wechat_pay' 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                💬 微信支付
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">金额（分）</label>
            <input type="number" value={amount} onChange={e => setAmount(parseInt(e.target.value || '0', 10))}
              className="w-full border px-3 py-2 rounded" min={100} step={10} />
            <div className="text-xs text-gray-500 mt-1">
              {paymentMethod === 'card' ? `$${(amount / 100).toFixed(2)}` : `¥${(amount / 100).toFixed(2)}`}
            </div>
          </div>

          <button onClick={createSession} disabled={loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60">
            {loading ? '创建会话中...' : 
             paymentMethod === 'card' ? '生成支付二维码' :
             paymentMethod === 'alipay' ? '跳转支付宝支付' : '跳转微信支付'}
          </button>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          {payUrl && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <img src={payUrl} width={220} height={220} alt="支付二维码" className="rounded shadow" />
              <a href={payUrl.replace(/^data:image\/png;base64,.*/, '') || '#'} target="_blank" rel="noreferrer" className="text-blue-600 underline hidden">原始链接</a>
              {/* 额外提供一个按钮直接跳转支付链接 */}
              <a id="openPayLink" className="text-blue-600 underline" target="_blank" rel="noreferrer">在新窗口打开支付链接</a>
              <script dangerouslySetInnerHTML={{__html:`(function(){
                const btn=document.getElementById('openPayLink');
                if(!btn) return; 
                // 在数据URL中无法直接还原原链接，这里在创建成功后同时记录原链接到 window 作用域
              })()`}} />
              <div className="text-xs text-gray-500">请使用支付宝扫码支付（若在移动端，可直接点击链接跳转）</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
