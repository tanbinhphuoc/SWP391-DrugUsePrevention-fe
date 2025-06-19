import React from 'react';
import { CheckCircle } from 'lucide-react';

const ProgressSteps = ({ currentStep }) => {
  return (
    <div className="flex items-center space-x-4 mt-4">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= step
                ? 'bg-green-400 text-black'
                : 'bg-white/20 text-white'
            }`}
          >
            {currentStep > step ? <CheckCircle size={16} /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-8 h-0.5 ${
                currentStep > step ? 'bg-green-400' : 'bg-white/20'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
