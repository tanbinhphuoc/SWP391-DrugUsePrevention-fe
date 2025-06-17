import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

// Giờ làm việc từ 7h - 19h
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 19; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

const bookedSlots = {
  '2025-06-19': ['09:00', '10:00', '14:00', '15:00'],
  '2025-06-20': ['08:00', '11:00', '16:00'],
  '2025-06-21': ['07:00', '13:00', '17:00', '18:00']
};

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const isTimeSlotAvailable = (date, time) => {
  const dateString = date.toISOString().split('T')[0];
  return !bookedSlots[dateString]?.includes(time);
};

const formatDate = (date) => {
  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  });
};

const Step3DateTimeSelection = ({
  selectedDate,
  selectedTimeSlots,
  setSelectedDate,
  setSelectedTimeSlots,
  calculateTotalPrice,
  formatPrice
}) => {
  const handleTimeSlotToggle = (time) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time].sort()
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Chọn ngày và giờ tư vấn</h3>

      {/* Date selection */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Chọn ngày:</h4>
        <div className="grid grid-cols-4 gap-2">
          {generateDates().map((date, index) => (
            <button
              key={index}
              className={`p-3 rounded-lg border text-sm ${
                selectedDate?.getTime() === date.getTime()
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTimeSlots([]);
              }}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Time selection */}
      {selectedDate && (
        <div>
          <h4 className="font-medium mb-3">Chọn giờ tư vấn (có thể chọn nhiều khung giờ):</h4>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {generateTimeSlots().map((time) => {
              const isAvailable = isTimeSlotAvailable(selectedDate, time);
              const isSelected = selectedTimeSlots.includes(time);
              return (
                <button
                  key={time}
                  disabled={!isAvailable}
                  className={`relative p-4 rounded-xl border-2 text-sm font-medium transition-all duration-300 transform ${
                    !isAvailable
                      ? 'border-red-200 bg-red-50 text-red-400 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg scale-105 ring-2 ring-emerald-200'
                      : 'border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50'
                  }`}
                  onClick={() => isAvailable && handleTimeSlotToggle(time)}
                >
                  <div className="flex items-center justify-center">
                    <Clock
                      size={14}
                      className={`mr-1 ${
                        isSelected ? 'text-white' : 'text-emerald-500'
                      }`}
                    />
                    {time}
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-emerald-600 rounded-full p-1">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xs text-red-500 font-medium bg-red-100 px-2 py-1 rounded-full">
                        Đã đặt
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Summary */}
          {selectedTimeSlots.length > 0 && (
            <div className="bg-emerald-50 rounded-lg p-4">
              <h5 className="font-medium text-emerald-800 mb-2">Thời gian đã chọn:</h5>
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTimeSlots.map((time) => (
                  <span
                    key={time}
                    className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                  >
                    {time}
                  </span>
                ))}
              </div>
              <div className="text-emerald-800">
                <span className="font-medium">Tổng thời gian:</span> {selectedTimeSlots.length} giờ
              </div>
              <div className="text-emerald-800">
                <span className="font-medium">Tổng chi phí:</span>{' '}
                {formatPrice(calculateTotalPrice())}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step3DateTimeSelection;
