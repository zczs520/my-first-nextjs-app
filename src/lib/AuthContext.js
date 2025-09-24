'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import supabase from './supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    // 获取当前用户
    const getCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        // 如果有用户，创建或更新用户配置
        if (session?.user) {
          await createUserProfile(session.user)
        }
      } catch (error) {
        console.error('获取当前用户失败:', error)
        setUser(null)
      } finally {
        setLoading(false)
        setInitializing(false)
      }
    }

    getCurrentUser()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('认证状态变化:', event, session?.user?.email)
        
        setUser(session?.user ?? null)
        setLoading(false)
        
        // 用户登录后创建或更新用户配置
        if (event === 'SIGNED_IN' && session?.user) {
          await createUserProfile(session.user)
        }
        
        // 登出时清理状态
        if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  // 创建用户配置
  const createUserProfile = async (user) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (error && error.code === 'PGRST116') {
      // 用户配置不存在，创建新的
      await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0],
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || ''
        })
    }
  }

  // 登录
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  // 注册
  const signUp = async (email, password, options = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options.metadata || {}
      }
    })
    return { data, error }
  }

  // 登出
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // 重置密码
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const value = {
    user,
    loading,
    initializing,
    signIn,
    signUp,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
