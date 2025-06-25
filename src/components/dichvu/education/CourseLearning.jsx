import React from 'react';
import { CheckCircle, PlayCircle, Lock, Clock, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import Breadcrumb from './Breadcrumb';

const CourseLearning = ({
  currentStep,
  selectedCourse,
  currentLessonIndex,
  courseProgress,
  videoWatched,
  isVideoPlaying,
  onPlayVideo,
  onCompleteLesson,
  onNavigateLesson
}) => {
  const currentLesson = selectedCourse.lessons_detail[currentLessonIndex];
  const isLessonCompleted = courseProgress[currentLesson.id];
  const completedLessons = Object.keys(courseProgress).length;
  const totalLessons = selectedCourse.lessons_detail.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Breadcrumb currentStep={currentStep} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{selectedCourse.title}</h1>
              <button
                onClick={() => onNavigateLesson('backToSelection')}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Quay lại
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Tiến độ học tập</span>
                <span className="text-purple-600 font-semibold">{completedLessons}/{totalLessons} bài</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Danh sách bài học</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedCourse.lessons_detail.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        index === currentLessonIndex
                          ? 'border-purple-300 bg-purple-50'
                          : index < currentLessonIndex || courseProgress[lesson.id]
                          ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                      onClick={() => {
                        if (index <= currentLessonIndex || courseProgress[lesson.id]) {
                          onNavigateLesson(index);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {courseProgress[lesson.id] ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          ) : index === currentLessonIndex ? (
                            <PlayCircle className="h-5 w-5 text-purple-600 mr-2" />
                          ) : (
                            <Lock className="h-5 w-5 text-gray-400 mr-2" />
                          )}
                          <span className={`text-sm font-medium ${
                            index === currentLessonIndex
                              ? 'text-purple-700'
                              : courseProgress[lesson.id]
                              ? 'text-green-700'
                              : 'text-gray-500'
                          }`}>
                            Bài {lesson.id}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{lesson.duration}</span>
                      </div>
                      <p className={`text-xs mt-1 ${
                        index === currentLessonIndex
                          ? 'text-purple-600'
                          : courseProgress[lesson.id]
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}>
                        {lesson.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-black rounded-t-3xl overflow-hidden">
                    {isVideoPlaying ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-white">
                          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                          <p>Đang phát video...</p>
                        </div>
                      </div>
                    ) : (
                      <iframe
                        src={currentLesson.video}
                        title={currentLesson.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>

                  {!videoWatched && !isVideoPlaying && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <button
                        onClick={onPlayVideo}
                        className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transition-all duration-300 transform hover:scale-110"
                      >
                        <PlayCircle className="h-12 w-12 text-purple-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentLesson.title}</h2>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{currentLesson.duration}</span>
                        <span className="mx-2">•</span>
                        <span>Bài {currentLesson.id}/{totalLessons}</span>
                      </div>
                    </div>

                    {videoWatched && !isLessonCompleted && (
                      <button
                        onClick={onCompleteLesson}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Hoàn thành bài học
                      </button>
                    )}

                    {isLessonCompleted && (
                      <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-2xl">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Đã hoàn thành
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                      onClick={() => onNavigateLesson(currentLessonIndex - 1)}
                      disabled={currentLessonIndex === 0}
                      className={`flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                        currentLessonIndex === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Bài trước
                    </button>

                    <button
                      onClick={() => onNavigateLesson(currentLessonIndex + 1)}
                      disabled={currentLessonIndex === totalLessons - 1 || !videoWatched}
                      className={`flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                        currentLessonIndex === totalLessons - 1 || !videoWatched
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      Bài tiếp
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </button>
                  </div>

                  {!videoWatched && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-yellow-800">Vui lòng xem hết video để hoàn thành bài học</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;