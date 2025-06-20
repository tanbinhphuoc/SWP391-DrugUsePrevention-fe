import React from 'react';

const Step4ContactInfo = ({ formData, setFormData, selectedService, selectedExpert, selectedDate, selectedTimeSlots, calculateTotalPrice, formatPrice }) => {
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>

      {/* Booking Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-2">Thông tin đặt lịch:</h4>
        <div className="text-sm space-y-1">
          <p><strong>Dịch vụ:</strong> {selectedService?.name}</p>
          <p><strong>Chuyên gia:</strong> {selectedExpert?.name}</p>
          <p><strong>Ngày:</strong> {selectedDate?.toLocaleDateString('vi-VN')}</p>
          <p><strong>Giờ:</strong> {selectedTimeSlots.join(', ')}</p>
          <p><strong>Thời gian:</strong> {selectedTimeSlots.length} giờ</p>
          <p className="text-lg font-semibold text-emerald-600">
            <strong>Tổng tiền:</strong> {formatPrice(calculateTotalPrice())}
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Họ và tên *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Nhập họ và tên của bạn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Nhập địa chỉ email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ghi chú (tùy chọn)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Mô tả tình hình hoặc câu hỏi cần tư vấn..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Step4ContactInfo;