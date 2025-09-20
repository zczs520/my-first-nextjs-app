import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: '联系我',
  description: '与枞哥取得联系，一起交流全栈开发经验',
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            联系我 📬
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            有任何问题或想法？欢迎与我交流！
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
