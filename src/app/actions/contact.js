'use server'

export async function submitContactForm(formData) {
  // 获取表单数据
  const name = formData.get('name')
  const email = formData.get('email')
  const subject = formData.get('subject')
  const message = formData.get('message')
  
  // 基础验证
  if (!name || !email || !subject || !message) {
    return { success: false, error: '所有字段都是必填的' }
  }
  
  // 模拟处理延迟（实际开发中这里会是数据库操作或邮件发送）
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 在控制台打印（后期会存储到数据库）
  console.log('收到新的联系表单:', {
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString()
  })
  
  // 返回成功响应
  return { 
    success: true, 
    message: '消息已收到，感谢您的联系！' 
  }
}
