'use client'
import { useState } from 'react'
import supabase from '../../lib/supabase'

export default function EnvCheck() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const [running, setRunning] = useState(false)
  const [results, setResults] = useState([])

  const pushResult = (title, ok, detail = '') => {
    setResults(prev => [...prev, { title, ok, detail }])
  }

  const runChecks = async () => {
    setRunning(true)
    setResults([])

    // 1) 环境变量
    pushResult('环境变量: NEXT_PUBLIC_SUPABASE_URL', !!supabaseUrl, supabaseUrl || '未配置')
    pushResult('环境变量: NEXT_PUBLIC_SUPABASE_ANON_KEY', !!supabaseKey, supabaseKey ? `${supabaseKey.substring(0, 20)}...` : '未配置')

    // 若变量缺失，后续检查也会失败，但继续执行以给出更多线索

    // 2) 认证可用性（获取当前会话）
    try {
      const timeout = 8000
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT: auth.getSession 超时')), timeout))
      const { data, error } = await Promise.race([supabase.auth.getSession(), timeoutPromise])
      if (error) {
        pushResult('认证: getSession', false, `${error.message}`)
      } else {
        pushResult('认证: getSession', true, data?.session ? '已登录会话存在' : '无会话（未登录）')
      }
    } catch (e) {
      pushResult('认证: getSession', false, e?.message || '未知错误')
    }

    // 3) 数据库连通性（轻量查询）
    try {
      const timeout = 8000
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT: 数据库查询超时')), timeout))
      // 使用一个存在的表做只读查询。若 RLS 拒绝，视为“连接可达但策略限制”。
      const queryPromise = supabase.from('projects').select('id', { count: 'exact', head: true })
      const { error, count } = await Promise.race([queryPromise, timeoutPromise])
      if (error) {
        // PostgREST 错误 -> 说明网络可达，但鉴权/策略有问题
        pushResult('数据库: projects 可达性', false, `可达但被拒绝/出错: ${error.message}`)
      } else {
        pushResult('数据库: projects 可达性', true, `可达 (count=${count ?? '未知'})`)
      }
    } catch (e) {
      // 网络错误/超时 -> 说明可能被拦截
      pushResult('数据库: projects 可达性', false, e?.message || '未知错误')
    }

    setRunning(false)
  }

  const statusSummary = () => {
    const hasTimeout = results.some(r => /TIMEOUT/i.test(r.detail))
    const varsOk = supabaseUrl && supabaseKey
    if (!varsOk) return '❌ 环境变量不完整，Vercel 需补齐后再测'
    if (hasTimeout) return '⚠️ 请求超时，可能是网络被拦截或 Supabase 暂不可达（可尝试切换网络/代理）'
    return '✅ 变量完整；如仍失败，查看下方具体步骤详情'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">环境与连通性自检</h1>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded border">
            <div className="font-semibold">Supabase URL:</div>
            <div className="text-sm mt-1">{supabaseUrl || '未配置'}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded border">
            <div className="font-semibold">Anon Key:</div>
            <div className="text-sm mt-1">{supabaseKey ? `${supabaseKey.substring(0, 20)}...` : '未配置'}</div>
          </div>

          <div className="p-4 bg-blue-50 rounded border border-blue-200">
            <div className="font-semibold text-blue-900">状态总结</div>
            <div className="text-blue-800 mt-1">{statusSummary()}</div>
          </div>

          <button
            onClick={runChecks}
            disabled={running}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {running ? '检测中...' : '开始检测'}
          </button>

          {!!results.length && (
            <div className="mt-4 space-y-3">
              {results.map((r, i) => (
                <div key={i} className={`p-3 rounded border ${r.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="font-medium">{r.ok ? '✅' : '❌'} {r.title}</div>
                  {r.detail && <div className="text-sm mt-1 text-gray-700 break-words">{r.detail}</div>}
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
            <div className="font-semibold text-yellow-900">提示</div>
            <ul className="text-yellow-800 list-disc list-inside mt-1 space-y-1">
              <li>若报 TIMEOUT，多为网络不可达（可尝试切换网络/代理）。</li>
              <li>若认证/数据库返回 PostgREST 错误而非超时，说明网络可达，需检查邮箱验证、凭证或 RLS 策略。</li>
              <li>生产部署需确保 Vercel 配置了 NEXT_PUBLIC_SUPABASE_URL / ANON_KEY，并已重启构建。</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}