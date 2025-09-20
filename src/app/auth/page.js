 'use client'
 
 import { useState } from 'react'
 
 export default function AuthPage() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
 
   async function handleSubmit(e) {
     e.preventDefault()
     setError('')
     setLoading(true)
     try {
       // TODO: Hook up your real auth logic (e.g., Supabase, NextAuth, custom API)
       // This dummy timeout simulates a request to avoid immediate resolution that can mask UI issues.
       await new Promise((res) => setTimeout(res, 400))
       console.log('Submitting auth with', { email, password })
       // On success, you can redirect with next/navigation or update state accordingly
       // Example: router.push('/dashboard')
     } catch (err) {
       console.error(err)
       setError('登录失败，请稍后重试。')
     } finally {
       setLoading(false)
     }
   }
 
   return (
     <div className="min-h-[60vh] flex items-center justify-center p-6">
       <div className="w-full max-w-md border rounded-lg p-6 shadow-sm">
         <h1 className="text-2xl font-semibold mb-1">登录</h1>
         <p className="text-sm text-gray-500 mb-6">请输入邮箱与密码继续</p>
 
         {error && (
           <div className="mb-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">
             {error}
           </div>
         )}
 
         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-sm mb-1" htmlFor="email">邮箱</label>
             <input
               id="email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
               placeholder="you@example.com"
             />
           </div>
 
           <div>
             <label className="block text-sm mb-1" htmlFor="password">密码</label>
             <input
               id="password"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
               placeholder="••••••••"
             />
           </div>
 
           <button
             type="submit"
             disabled={loading}
             className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded px-4 py-2"
           >
             {loading ? '正在登录…' : '登录'}
           </button>
         </form>
 
         <p className="text-xs text-gray-500 mt-4">
           提示：此为示例页面。请将提交逻辑接入真实的认证服务（如 Supabase / NextAuth）。
         </p>
       </div>
     </div>
   )
}

