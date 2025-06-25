import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const Step3DateTimeSelection = ({ selectedDate, setSelectedDate, selectedTimeSlots, setSelectedTimeSlots }) => {
  const bookedSlots = {
    '2025-06-20': ['09:00', '10:00', '14:00'],
    '2025-06-21': ['11:00', '15:00', '16:00'],
    '2025-06-22': ['08:00', '13:00', '17:00'],
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

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 19; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const isTimeSlotBooked = (date, time) => {
    if (!date) return false;
    const dateString = date.toISOString().split('T')[0];
    return bookedSlots[dateString]?.includes(time) || false;
  };

  const handleTimeSlotToggle = (time) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  const getAvailableTimeSlots = () => {
    return generateTimeSlots().filter(time => !isTimeSlotBooked(selectedDate, time));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Chọn ngày và giờ tư vấn</h3>

      {/* Date Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="text-emerald-600" size={20} />
          <h4 className="font-medium">Chọn ngày:</h4>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {generateDates().map((date, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedDate(date);
                setSelectedTimeSlots([]);
              }}
              className={`p-2 text-sm rounded-lg transition-all hover:shadow-md ${
                selectedDate?.toDateString() === date.toDateString()
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="text-emerald-600" size={20} />
            <h4 className="font-medium">Chọn giờ:</h4>
          </div>

          <div className="mb-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Lưu ý:</strong> Chỉ hiển thị các khung giờ còn trống. Những khung giờ đã được đặt sẽ không hiển thị.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {getAvailableTimeSlots().map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSlotToggle(time)}
                className={`p-3 text-sm rounded-lg transition-all hover:shadow-md ${
                  selectedTimeSlots.includes(time)
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Clock size={14} />
                  {time}
                </div>
              </button>
            ))}
          </div>

          {getAvailableTimeSlots().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock size={48} className="mx-auto mb-2 text-gray-300" />
              <p>Không có khung giờ nào còn trống trong ngày này</p>
              <p className="text-sm">Vui lòng chọn ngày khác</p>
            </div>
          )}

          {selectedTimeSlots.length > 0 && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-700">
                <strong>Đã chọn:</strong> {selectedTimeSlots.join(', ')}
                <span className="ml-2">({selectedTimeSlots.length} giờ)</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step3DateTimeSelection;