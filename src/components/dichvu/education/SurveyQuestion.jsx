import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const SurveyQuestion = ({
  currentStep,
  currentQuestionIndex,
  questions,
  onAnswer,
  onBack
}) => {
  const currentQuestion = questions[currentQuestionIndex];
  const isPostSurvey = currentStep === 'post-survey';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Breadcrumb currentStep={currentStep} />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {isPostSurvey ? 'Khảo sát sau học' : 'Khảo sát đầu vào'}
                </h2>
                <span className="text-lg text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  {currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
                {currentQuestion.question}
              </h3>
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onAnswer(option.score)}
                    className="w-full p-6 text-left bg-gray-50 hover:bg-purple-50 rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 transform hover:scale-[1.02] group"
                  >
                    <span className="text-gray-800 font-medium text-lg group-hover:text-purple-700">
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {currentQuestionIndex > 0 && (
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Câu hỏi trước
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestion;