import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import Step1ServiceSelection from './Step1ServiceSelection';
import Step2ExpertSelection from './Step2ExpertSelection';
import Step3DateTimeSelection from './Step3DateTimeSelection';
import Step4ContactInfo from './Step4ContactInfo';
import ProgressSteps from './ProgressSteps';

const BookingModal = ({
  currentStep,
  setCurrentStep,
  onClose,
  services,
  experts,
  selectedService,
  selectedExpert,
  selectedDate,
  selectedTimeSlots,
  setSelectedService,
  setSelectedExpert,
  setSelectedDate,
  setSelectedTimeSlots,
  formData,
  setFormData,
  handleNextStep,
  handlePrevStep,
  calculateTotalPrice,
  formatPrice,
  handleBookingComplete
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-2">Đặt lịch tư vấn trực tuyến</h2>
          <ProgressSteps currentStep={currentStep} />
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {currentStep === 1 && (
            <Step1ServiceSelection
              services={services}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
            />
          )}
          {currentStep === 2 && (
            <Step2ExpertSelection
              experts={experts}
              selectedExpert={selectedExpert}
              setSelectedExpert={setSelectedExpert}
            />
          )}
          {currentStep === 3 && (
            <Step3DateTimeSelection
              selectedDate={selectedDate}
              selectedTimeSlots={selectedTimeSlots}
              setSelectedDate={setSelectedDate}
              setSelectedTimeSlots={setSelectedTimeSlots}
              calculateTotalPrice={calculateTotalPrice}
              formatPrice={formatPrice}
            />
          )}
          {currentStep === 4 && (
            <Step4ContactInfo
              selectedService={selectedService}
              selectedExpert={selectedExpert}
              selectedDate={selectedDate}
              selectedTimeSlots={selectedTimeSlots}
              formData={formData}
              setFormData={setFormData}
              calculateTotalPrice={calculateTotalPrice}
              formatPrice={formatPrice}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t p-6 flex justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Quay lại
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              disabled={
                (currentStep === 1 && !selectedService) ||
                (currentStep === 2 && !selectedExpert) ||
                (currentStep === 3 && (!selectedDate || selectedTimeSlots.length === 0))
              }
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tiếp tục
            </button>
          ) : (
            <button
              onClick={handleBookingComplete}
              disabled={!formData.name || !formData.phone}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Xác nhận đặt lịch
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
