// components/consultation/Step4ContactInfo.jsx
import React from 'react';

const Step4ContactInfo = ({
  selectedService,
  selectedExpert,
  selectedDate,
  selectedTimeSlots,
  formData,
  setFormData,
  calculateTotalPrice,
  formatPrice
}) => {
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
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-2">Tóm tắt đặt lịch:</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium">Dịch vụ:</span> {selectedService?.name}</p>
          <p><span className="font-medium">Chuyên gia:</span> {selectedExpert?.name}</p>
          <p><span className="font-medium">Ngày:</span> {selectedDate?.toLocaleDateString('vi-VN')}</p>
          <p><span className="font-medium">Giờ:</span> {selectedTimeSlots.join(', ')}</p>
          <p><span className="font-medium">Thời gian:</span> {selectedTimeSlots.length} giờ</p>
          <p>
            <span className="font-medium">Tổng phí:</span>{' '}
            <span className="text-emerald-600 font-semibold">
              {formatPrice(calculateTotalPrice())}
            </span>
          </p>
          <p className="text-blue-600 font-medium">📹 Tư vấn trực tuyến qua video call</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Nhập email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả vấn đề cần tư vấn
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Mô tả ngắn gọn vấn đề cần tư vấn để chuyên gia chuẩn bị tốt nhất"
          />
        </div>
      </div>
    </div>
  );
};

export default Step4ContactInfo;
