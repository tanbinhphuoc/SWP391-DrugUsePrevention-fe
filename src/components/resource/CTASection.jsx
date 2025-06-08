const CTASection = () => {
  return (
    <div className="mt-16 bg-gradient-to-r from-sky-600 to-emerald-600 rounded-2xl p-8 text-center text-white shadow-2xl">
      <h3 className="text-3xl font-bold mb-4">Cần tài nguyên tùy chỉnh?</h3>
      <p className="text-sky-100 mb-6 max-w-2xl mx-auto text-lg">
        Đội ngũ chuyên gia của chúng tôi có thể tạo ra các tài nguyên và tư vấn 
        được cá nhân hóa theo nhu cầu cụ thể của bạn hoặc tổ chức.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-white text-sky-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors text-lg">
          Liên hệ tư vấn
        </button>
        <button className="border-2 border-white text-white hover:bg-white hover:text-sky-600 px-8 py-3 rounded-lg font-semibold transition-colors text-lg">
          Yêu cầu tài nguyên
        </button>
      </div>
    </div>
  )
}

export default CTASection
