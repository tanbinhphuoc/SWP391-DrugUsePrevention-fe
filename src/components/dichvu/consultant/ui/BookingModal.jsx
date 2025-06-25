import React from 'react';
import { X, Check } from 'lucide-react';
import Step1ServiceSelection from './Step1ServiceSelection';
import Step2ExpertSelection from './Step2ExpertSelection';
import Step3DateTimeSelection from './Step3DateTimeSelection';
import Step4ContactInfo from './Step4ContactInfo';

const BookingModal = ({ 
  currentStep, onClose, services, experts,
  selectedService, selectedExpert, selectedDate, selectedTimeSlots,
  setSelectedService, setSelectedExpert, setSelectedDate, setSelectedTimeSlots,
  formData, setFormData, handleNextStep, handlePrevStep,
  calculateTotalPrice, formatPrice, handleBookingComplete
}) => {
  const isStepValid = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return selectedExpert !== null;
      case 3: return selectedDate !== null && selectedTimeSlots.length > 0;
      case 4: return formData.name && formData.email && formData.phone;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1ServiceSelection services={services} selectedService={selectedService} setSelectedService={setSelectedService} />;
      case 2:
        return <Step2ExpertSelection experts={experts} selectedService={selectedService} selectedExpert={selectedExpert} setSelectedExpert={setSelectedExpert} />;
      case 3:
        return <Step3DateTimeSelection selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTimeSlots={selectedTimeSlots} setSelectedTimeSlots={setSelectedTimeSlots} />;
      case 4:
        return <Step4ContactInfo formData={formData} setFormData={setFormData} selectedService={selectedService} selectedExpert={selectedExpert} selectedDate={selectedDate} selectedTimeSlots={selectedTimeSlots} calculateTotalPrice={calculateTotalPrice} formatPrice={formatPrice} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Đặt lịch tư vấn trực tuyến</h2>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6 px-4">
            {[1, 2, 3, 4].map((step, index) => {
              const labels = ['Chọn dịch vụ', 'Chọn chuyên gia', 'Chọn thời gian', 'Thông tin'];
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;
              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 transform ${
                      isCompleted ? 'bg-white text-emerald-600 shadow-lg scale-110' :
                      isCurrent ? 'bg-yellow-400 text-emerald-800 shadow-lg scale-110 animate-pulse' :
                      'bg-white/30 text-white/70 scale-100'
                    }`}>
                      {isCompleted ? <Check size={20} className="animate-bounce" /> : <span>{step}</span>}
                      {isCurrent && <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping"></div>}
                      {isCompleted && <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>}
                    </div>
                    <div className={`mt-2 text-xs font-medium text-center transition-all duration-300 ${
                      isCompleted || isCurrent ? 'text-white' : 'text-white/50'
                    }`}>
                      {labels[index]}
                    </div>
                  </div>
                  {step < 4 && <div className="flex-1 mx-4 h-1 bg-white/20 rounded-full">
                    {step < currentStep && <div className="h-full bg-gradient-to-r from-white to-yellow-200 w-full shadow-sm"></div>}
                  </div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-between">
          <button onClick={handlePrevStep} disabled={currentStep === 1} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Quay lại</button>
          {currentStep < 4 ? (
            <button onClick={handleNextStep} disabled={!isStepValid()} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">Tiếp tục</button>
          ) : (
            <button onClick={handleBookingComplete} disabled={!isStepValid()} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">Xác nhận đặt lịch</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;