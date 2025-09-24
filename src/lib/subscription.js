// 订阅系统工具函数
import supabase from './supabase'

// 获取用户订阅信息
export async function getUserSubscription(userId) {
  if (!userId) return null
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('subscription_tier, subscription_status, subscription_end_date, stripe_customer_id, stripe_subscription_id')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('获取用户订阅信息失败:', error)
      return null
    }
    
    return data
  } catch (err) {
    console.error('获取用户订阅信息异常:', err)
    return null
  }
}

// 获取用户使用统计
export async function getUserUsage(userId) {
  if (!userId) return { projects_count: 0, blogs_count: 0 }
  
  try {
    // 先尝试从 usage_counts 表获取
    const { data: usageData, error: usageError } = await supabase
      .from('usage_counts')
      .select('projects_count, blogs_count')
      .eq('user_id', userId)
      .single()
    
    if (!usageError && usageData) {
      return usageData
    }
    
    // 如果没有记录，实时统计并创建记录
    const [projectsResult, blogsResult] = await Promise.all([
      supabase
        .from('projects')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
      supabase
        .from('blog_posts')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
    ])
    
    const projectsCount = projectsResult.count || 0
    const blogsCount = blogsResult.count || 0
    
    // 创建或更新使用统计记录
    await supabase
      .from('usage_counts')
      .upsert({
        user_id: userId,
        projects_count: projectsCount,
        blogs_count: blogsCount,
        updated_at: new Date().toISOString()
      })
    
    return {
      projects_count: projectsCount,
      blogs_count: blogsCount
    }
  } catch (err) {
    console.error('获取用户使用统计异常:', err)
    return { projects_count: 0, blogs_count: 0 }
  }
}

// 检查用户是否可以创建资源
export async function canCreateResource(userId, resourceType) {
  if (!userId) return false
  
  try {
    const [subscription, usage] = await Promise.all([
      getUserSubscription(userId),
      getUserUsage(userId)
    ])
    
    // 会员版无限制
    if (subscription?.subscription_tier === 'premium' && 
        subscription?.subscription_status === 'active') {
      return true
    }
    
    // 免费版检查限制
    const limits = {
      project: 3,
      blog: 3
    }
    
    const currentCount = resourceType === 'project' ? usage.projects_count : usage.blogs_count
    return currentCount < limits[resourceType]
  } catch (err) {
    console.error('检查资源创建权限异常:', err)
    return false
  }
}

// 更新用户使用统计
export async function updateUserUsage(userId, resourceType, action = 'increment') {
  if (!userId) return
  
  try {
    const current = await getUserUsage(userId)
    const field = resourceType === 'project' ? 'projects_count' : 'blogs_count'
    const newCount = action === 'increment' 
      ? current[field] + 1 
      : Math.max(0, current[field] - 1)
    
    await supabase
      .from('usage_counts')
      .upsert({
        user_id: userId,
        [field]: newCount,
        updated_at: new Date().toISOString()
      })
  } catch (err) {
    console.error('更新用户使用统计异常:', err)
  }
}

// 更新用户订阅状态
export async function updateUserSubscription(userId, subscriptionData) {
  if (!userId) return false
  
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        subscription_tier: subscriptionData.tier,
        subscription_status: subscriptionData.status,
        subscription_start_date: subscriptionData.start_date,
        subscription_end_date: subscriptionData.end_date,
        stripe_customer_id: subscriptionData.stripe_customer_id,
        stripe_subscription_id: subscriptionData.stripe_subscription_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) {
      console.error('更新用户订阅状态失败:', error)
      return false
    }
    
    return true
  } catch (err) {
    console.error('更新用户订阅状态异常:', err)
    return false
  }
}

// 检查订阅是否有效
export function isSubscriptionActive(subscription) {
  if (!subscription) return false
  
  return subscription.subscription_tier === 'premium' && 
         subscription.subscription_status === 'active' &&
         (!subscription.subscription_end_date || 
          new Date(subscription.subscription_end_date) > new Date())
}
