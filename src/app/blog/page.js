import dynamic from 'next/dynamic'
const BlogClient = dynamic(() => import('../../components/BlogClient'), { ssr: false })

export const metadata = {
  title: '学习博客',
  description: '30天全栈开发学习记录和心得分享',
}

export default function Blog() {
  return <BlogClient />
}