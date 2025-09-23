'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorDetail, setErrorDetail] = useState(null)
  const [loginMethod, setLoginMethod] = useState('otp') // 仍保留，但下方两个方式同时展示
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpCountdown, setOtpCountdown] = useState(0)
  const router = useRouter()

  const formatAuthError = (err) => {
    if (!err) return ''
    const status = err.status
    const msg = err.message || '未知错误'
    let hint = ''
    if (status === 400) {
      hint = '可能原因：1) 邮箱或密码不正确；2) 邮箱未完成验证；3) 生产环境变量未正确配置。'
    } else if (status === 422) {
      hint = '请求参数无效，请检查邮箱格式与密码长度。'
    }

  // 发送邮箱验证码（OTP 登录）
  const handleSendOtp = async () => {
    if (!email) {
      setMessage('请先填写邮箱地址，再发送验证码')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // 若不存在则创建
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth` : undefined,
        },
      })
      if (error) {
        setMessage(`发送验证码失败: ${error.message}`)
      } else {
        setOtpSent(true)
        setMessage('验证码已发送到邮箱，请查收并输入')
        // 启动 60 秒倒计时
        setOtpCountdown(60)
        const timer = setInterval(() => {
          setOtpCountdown((t) => {
            if (t <= 1) {
              clearInterval(timer)
              return 0
            }
            return t - 1
          })
        }, 1000)
      }
    } finally {
      setLoading(false)
    }
  }
    return `登录失败 (${status ?? '未知状态'}): ${msg}。${hint}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setErrorDetail(null)

    try {
      if (isLogin) {
        if (loginMethod === 'otp') {
          // 验证邮箱验证码（OTP）
          if (!email) {
            setMessage('请先填写邮箱，再进行验证码登录')
            return
          }
          if (!otpCode) {
            setMessage('请输入邮箱收到的验证码')
            return
          }
          // verifyOtp 会完成登录
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: otpCode,
            type: 'email',
          })
          if (error) {
            setMessage(`验证码登录失败: ${error.message}`)
          } else {
            setMessage('登录成功！正在跳转...')
            setTimeout(() => router.push('/dashboard'), 800)
          }
          return
        }
        // 密码登录：增加更长超时和一次重试
        const doSignIn = async () => {
          const timeoutMs = 30000
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject({ status: 'TIMEOUT', message: '请求超时，请检查网络或目标服务可达性' }), timeoutMs))
          const signInPromise = supabase.auth.signInWithPassword({ email, password })
          return await Promise.race([signInPromise, timeoutPromise])
        }

        let { error } = await doSignIn()
        if (error && (error.status === 'TIMEOUT')) {
          // 等待1秒后重试一次
          await new Promise(r => setTimeout(r, 1000))
          const ret = await doSignIn()
          error = ret.error
        }
        if (error) {
          setMessage(formatAuthError(error))
          setErrorDetail({ status: error.status ?? null, message: error.message ?? '' })
        } else {
          setMessage('登录成功！正在跳转...')
          setTimeout(() => router.push('/dashboard'), 800)
        }
      } else {
        // 注册
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        })
        if (error) {
          setMessage(`注册失败: ${error.message}`)
        } else {
          setMessage('注册成功！请检查邮箱验证链接。')
          setEmail('')
          setPassword('')
          setFullName('')
        }
      }
    } catch (error) {
      console.error('认证错误:', error)
      if (error && error.status === 'TIMEOUT') {
        setMessage('登录请求超时：可能被网络拦截或目标服务不可达。请稍后再试，或检查网络/Supabase 可用性。')
      } else {
        setMessage(`操作失败: ${error?.message || '未知错误'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setLoading(true)
    setMessage('')
    try {
      if (!email) {
        setMessage('请先在邮箱输入框填写你的邮箱地址，再点击“忘记密码？”')
        return
      }
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) {
        setMessage(`重置密码邮件发送失败(${error.status ?? '未知'}): ${error.message}`)
      } else {
        setMessage('已发送重置密码邮件，请前往邮箱检查。')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? '登录账号' : '创建账号'}
        </h2>
        {isLogin && (
          <div className="mt-3 text-center text-sm bg-yellow-50 text-yellow-800 border border-yellow-200 rounded p-3">
            为提高成功率，<span className="font-medium">推荐使用“验证码登录”</span>。某些网络下“密码登录”可能连接较慢或超时。
          </div>
        )}
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? '还没有账号？' : '已有账号？'}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
            }}
            className="font-medium text-blue-600 hover:text-blue-500 ml-1"
          >
            {isLogin ? '立即注册' : '立即登录'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* 登录/注册切换（两个登录方式将同时展示，避免切换看不到的问题） */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button
                onClick={() => { setIsLogin(!isLogin); setMessage(''); setErrorDetail(null) }}
                className="font-medium text-blue-600 hover:text-blue-500 ml-1"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  姓名 *
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="请输入您的姓名"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱地址 *
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            {/* 密码登录（方式一） */}
            {isLogin && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码 {isLogin && '*'}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required={loginMethod === 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={isLogin ? "请输入密码" : "请设置密码（至少6位）"}
                    minLength={isLogin ? undefined : 6}
                  />
                </div>
                {!isLogin && (
                  <p className="mt-1 text-xs text-gray-500">
                    密码至少6个字符
                  </p>
                )}
              </div>
            )}

            {/* 验证码登录（方式二，推荐） */}
            {isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  邮箱验证码
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    id="otpCode"
                    name="otpCode"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="请输入邮箱收到的验证码"
                  />
                  <button
                    type="button"
                    disabled={loading || otpCountdown > 0}
                    onClick={handleSendOtp}
                    className="px-3 py-2 rounded-md border text-sm disabled:opacity-50"
                  >
                    {otpCountdown > 0 ? `${otpCountdown}s` : (otpSent ? '重新发送' : '发送验证码')}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">推荐优先使用验证码登录；若收不到邮件，可改用密码登录。</p>
              </div>
            )}

            {message && (
              <div className={`p-3 rounded-md text-sm border ${
                message.includes('成功') ? 
                  'bg-green-100 text-green-700 border-green-200' : 
                  'bg-red-100 text-red-700 border-red-200'
              }`}>
                {message}
                {errorDetail && (
                  <div className="mt-2 text-xs text-gray-600">
                    <div>状态码：{String(errorDetail.status ?? '未知')}</div>
                    <div>后端信息：{errorDetail.message || '无'}</div>
                    <div className="mt-1">
                      建议：
                      <ul className="list-disc list-inside">
                        <li>确认邮箱与密码输入正确（注意大小写与空格）。</li>
                        <li>若项目开启邮箱验证，请先完成邮箱验证。</li>
                        <li>如在生产环境，请确认 Vercel 中 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 已正确配置。</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </span>
                ) : (
                  isLogin ? '登录' : '注册'
                )}
              </button>
            </div>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <button onClick={handleResetPassword} className="text-sm text-blue-600 hover:text-blue-500">
                忘记密码？
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
