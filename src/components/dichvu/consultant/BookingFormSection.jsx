import { ArrowRight } from 'lucide-react';

// Booking Form Section Component
const BookingFormSection = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <div className="relative py-20 px-6">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Đặt lịch Tư vấn</h2>
          <p className="text-xl text-blue-100">
            Điền thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất
          </p>
        </div>
        
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
                  placeholder="0123 456 789"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Dịch vụ</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
                >
                  <option value="" className="bg-blue-900">Chọn dịch vụ</option>
                  <option value="personal" className="bg-blue-900">Tư vấn cá nhân</option>
                  <option value="online" className="bg-blue-900">Tư vấn trực tuyến</option>
                  <option value="group" className="bg-blue-900">Tư vấn nhóm</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-white font-semibold mb-2">Tin nhắn</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm resize-none"
                placeholder="Mô tả chi tiết về vấn đề bạn cần tư vấn..."
              ></textarea>
            </div>
            
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-yellow-400 text-blue-900 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Gửi yêu cầu tư vấn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default BookingFormSection;
