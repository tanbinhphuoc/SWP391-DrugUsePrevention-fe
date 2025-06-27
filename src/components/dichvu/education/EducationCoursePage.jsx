import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Lock, 
  Star, 
  Clock, 
  Users, 
  Award,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Target,
  TrendingUp,
  User,
  Calendar,
  PlayCircle,
  Pause,
  RotateCcw,
  Home,
  ChevronRight,
  GraduationCap,
  Trophy,
  BarChart3
} from 'lucide-react';

// Mock data for courses
const coursesData = {
  student: {
    id: 'student-course',
    title: 'Khóa học dành cho học sinh (0-18 tuổi)',
    description: 'Hiểu về tác hại của ma túy và cách phòng chống trong môi trường học đường',
    duration: '4 giờ',
    lessons: 8,
    rating: 4.8,
    students: 1250,
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=300&fit=crop',
    price: 'Miễn phí',
    level: 'Cơ bản',
    lessons_detail: [
      { id: 1, title: 'Giới thiệu về ma túy và tác hại', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15 phút', completed: false },
      { id: 2, title: 'Nhận biết các loại ma túy phổ biến', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20 phút', completed: false },
      { id: 3, title: 'Tác động của ma túy đến sức khỏe', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25 phút', completed: false },
      { id: 4, title: 'Kỹ năng từ chối và tự bảo vệ', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30 phút', completed: false },
      { id: 5, title: 'Xây dựng lối sống tích cực', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20 phút', completed: false },
      { id: 6, title: 'Tìm kiếm sự hỗ trợ khi cần thiết', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18 phút', completed: false },
      { id: 7, title: 'Hoạt động nhóm và thảo luận', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25 phút', completed: false },
      { id: 8, title: 'Tổng kết và cam kết hành động', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '17 phút', completed: false }
    ]
  },
  university: {
    id: 'university-course',
    title: 'Khóa học dành cho sinh viên (19-25 tuổi)',
    description: 'Nhận thức về rủi ro ma túy trong môi trường đại học và xã hội',
    duration: '5 giờ',
    lessons: 10,
    rating: 4.9,
    students: 890,
    thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=300&fit=crop',
    price: '299.000 VNĐ',
    level: 'Trung bình',
    lessons_detail: [
      { id: 1, title: 'Ma túy trong môi trường đại học', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20 phút', completed: false },
      { id: 2, title: 'Áp lực xã hội và cách đối phó', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25 phút', completed: false },
      { id: 3, title: 'Tác động nghiêm trọng đến tương lai', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30 phút', completed: false },
      { id: 4, title: 'Kỹ năng giao tiếp và từ chối', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28 phút', completed: false },
      { id: 5, title: 'Quản lý stress và cảm xúc', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22 phút', completed: false },
      { id: 6, title: 'Xây dựng mạng lưới hỗ trợ tích cực', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25 phút', completed: false },
      { id: 7, title: 'Pháp luật và hậu quả pháp lý', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20 phút', completed: false },
      { id: 8, title: 'Nghề nghiệp và cơ hội phát triển', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18 phút', completed: false },
      { id: 9, title: 'Hỗ trợ người khác và cộng đồng', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22 phút', completed: false },
      { id: 10, title: 'Kế hoạch hành động cá nhân', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20 phút', completed: false }
    ]
  },
  parent: {
    id: 'parent-course',
    title: 'Khóa học dành cho phụ huynh (26+ tuổi)',
    description: 'Hướng dẫn phụ huynh bảo vệ con em khỏi tệ nạn ma túy',
    duration: '6 giờ',
    lessons: 12,
    rating: 4.7,
    students: 650,
    thumbnail: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?w=500&h=300&fit=crop',
    price: '499.000 VNĐ',
    level: 'Nâng cao',
    lessons_detail: [
      { id: 1, title: 'Hiểu về tâm lý trẻ em và thanh thiếu niên', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25 phút', completed: false },
      { id: 2, title: 'Nhận biết dấu hiệu sử dụng ma túy', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30 phút', completed: false },
      { id: 3, title: 'Giao tiếp hiệu quả với con em', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35 phút', completed: false },
      { id: 4, title: 'Xây dựng môi trường gia đình tích cực', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28 phút', completed: false },
      { id: 5, title: 'Giám sát và hỗ trợ phù hợp', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22 phút', completed: false },
      { id: 6, title: 'Tác động của mạng xã hội và bạn bè', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30 phút', completed: false },
      { id: 7, title: 'Ứng phó khi phát hiện con sử dụng ma túy', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '40 phút', completed: false },
      { id: 8, title: 'Tìm kiếm sự hỗ trợ chuyên nghiệp', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25 phút', completed: false },
      { id: 9, title: 'Phục hồi và tái hòa nhập', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35 phút', completed: false },
      { id: 10, title: 'Mạng lưới hỗ trợ phụ huynh', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20 phút', completed: false },
      { id: 11, title: 'Phòng ngừa tái phạm', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25 phút', completed: false },
      { id: 12, title: 'Xây dựng kế hoạch dài hạn', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30 phút', completed: false }
    ]
  }
};

// ASSIST Survey Questions
const assistQuestions = [
  {
    id: 1,
    question: "Trong 3 tháng qua, bạn có bao giờ uống rượu bia không?",
    options: [
      { text: "Không bao giờ", score: 0 },
      { text: "1-2 lần", score: 1 },
      { text: "Hàng tuần", score: 2 },
      { text: "Hàng ngày", score: 4 }
    ]
  },
  {
    id: 2,
    question: "Trong 3 tháng qua, bạn có bao giờ sử dụng thuốc lá không?",
    options: [
      { text: "Không bao giờ", score: 0 },
      { text: "Thỉnh thoảng", score: 1 },
      { text: "Hàng tuần", score: 2 },
      { text: "Hàng ngày", score: 4 }
    ]
  },
  {
    id: 3,
    question: "Trong 3 tháng qua, bạn có bao giờ sử dụng cần sa không?",
    options: [
      { text: "Không bao giờ", score: 0 },
      { text: "1-2 lần", score: 2 },
      { text: "Hàng tuần", score: 4 },
      { text: "Hàng ngày", score: 4 }
    ]
  },
  {
    id: 4,
    question: "Trong 3 tháng qua, bạn có bao giờ sử dụng chất kích thích khác không?",
    options: [
      { text: "Không bao giờ", score: 0 },
      { text: "1-2 lần", score: 2 },
      { text: "Thỉnh thoảng", score: 4 },
      { text: "Thường xuyên", score: 4 }
    ]
  }
];

// CRAFFT Survey Questions  
const crafftQuestions = [
  {
    id: 1,
    question: "Bạn có bao giờ đi trên xe hơi do người đã uống rượu bia hoặc sử dụng ma túy lái xe không?",
    options: [
      { text: "Không", score: 0 },
      { text: "Có", score: 1 }
    ]
  },
  {
    id: 2,
    question: "Bạn có sử dụng rượu bia hoặc ma túy để thư giãn, cảm thấy tốt hơn về bản thân hoặc hòa nhập không?",
    options: [
      { text: "Không", score: 0 },
      { text: "Có", score: 1 }
    ]
  },
  {
    id: 3,
    question: "Bạn có sử dụng rượu bia hoặc ma túy khi ở một mình không?",
    options: [
      { text: "Không", score: 0 },
      { text: "Có", score: 1 }
    ]
  },
  {
    id: 4,
    question: "Bạn có quên những việc đã làm khi sử dụng rượu bia hoặc ma túy không?",
    options: [
      { text: "Không", score: 0 },
      { text: "Có", score: 1 }
    ]
  },
  {
    id: 5,
    question: "Gia đình hoặc bạn bè có nói rằng bạn nên cắt giảm việc uống rượu bia hoặc sử dụng ma túy không?",
    options: [
      { text: "Không", score: 0 },
      { text: "Có", score: 1 }
    ]
  },
  {
    id: 6,
    question: "Bạn có gặp rắc rối khi đang uống rượu bia hoặc sử dụng ma túy không?",
    options: [
      { text: "Không", score: 0 },
      { text: "Có", score: 1 }
    ]
  }
];

const EducationCoursesPage = () => {
  // States for survey and user flow
  const [currentStep, setCurrentStep] = useState('survey-start'); // survey-start, pre-survey, course-selection, course-learning, post-survey, results, consultation-redirect
  const [userAge, setUserAge] = useState(null);
  const [surveyType, setSurveyType] = useState('assist'); // assist or crafft
  const [currentSurveyQuestion, setCurrentSurveyQuestion] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState([]);
  const [preSurveyScore, setPreSurveyScore] = useState(null);
  const [postSurveyScore, setPostSurveyScore] = useState(null);
  const [recommendedCourse, setRecommendedCourse] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [courseProgress, setCourseProgress] = useState({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasConsulted, setHasConsulted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  // Initialize survey based on age
  useEffect(() => {
    if (userAge) {
      setSurveyType(userAge < 18 ? 'crafft' : 'assist');
    }
  }, [userAge]);

   // Handle starting survey - now gets age from user account
  const handleStartSurvey = () => {
    // In a real app, you would get userAge from the user's account/profile
    // For now, we'll simulate getting it from account data
    const accountAge = getUserAgeFromAccount(); // This would be your actual function
    setUserAge(accountAge);
    setCurrentStep('pre-survey');
  };

  // Simulate getting user age from account
  const getUserAgeFromAccount = () => {
    // This is a placeholder - replace with actual account data retrieval
    return 22; // Example age from user account
  };

  // Handle survey answer
  const handleSurveyAnswer = (answerScore) => {
    const newAnswers = [...surveyAnswers, answerScore];
    setSurveyAnswers(newAnswers);

    const questions = surveyType === 'assist' ? assistQuestions : crafftQuestions;
    
    if (currentSurveyQuestion < questions.length - 1) {
      setCurrentSurveyQuestion(currentSurveyQuestion + 1);
    } else {
      // Calculate total score
      const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
      
      if (currentStep === 'pre-survey') {
        setPreSurveyScore(totalScore);
        handlePreSurveyComplete(totalScore);
      } else {
        setPostSurveyScore(totalScore);
        setCurrentStep('results');
      }
    }
  };

  // Handle pre-survey completion
  const handlePreSurveyComplete = (score) => {
    if (score > 5) {
      // Redirect to consultation
      setHasConsulted(true);
      setCurrentStep('consultation-redirect');
    } else if (score === 4) {
      // Show appropriate course or expand selection
      const ageGroup = userAge < 18 ? 'student' : userAge <= 25 ? 'university' : 'parent';
      setRecommendedCourse(coursesData[ageGroup]);
      setAvailableCourses(Object.values(coursesData));
      setCurrentStep('course-selection');
    } else {
      // Score < 4 - show only recommended course
      const ageGroup = userAge < 18 ? 'student' : userAge <= 25 ? 'university' : 'parent';
      setRecommendedCourse(coursesData[ageGroup]);
      setAvailableCourses([coursesData[ageGroup]]);
      setCurrentStep('course-selection');
    }
  };

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setCurrentLessonIndex(0);
    setVideoWatched(false);
    setCurrentStep('course-learning');
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    const updatedProgress = { ...courseProgress };
    const lessonId = selectedCourse.lessons_detail[currentLessonIndex].id;
    updatedProgress[lessonId] = true;
    setCourseProgress(updatedProgress);

    if (currentLessonIndex < selectedCourse.lessons_detail.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setVideoWatched(false);
    } else {
      // Course completed - start post survey
      setSurveyAnswers([]);
      setCurrentSurveyQuestion(0);
      setCurrentStep('post-survey');
    }
  };

  // Handle video play
  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    // Simulate video watching completion after 3 seconds
    setTimeout(() => {
      setVideoWatched(true);
      setIsVideoPlaying(false);
    }, 3000);
  };

  // Restart survey
  const restartSurvey = () => {
    setSurveyAnswers([]);
    setCurrentSurveyQuestion(0);
    setPreSurveyScore(null);
    setPostSurveyScore(null);
    setSelectedCourse(null);
    setCourseProgress({});
    setCurrentStep('age-selection');
  };

  // Render breadcrumb
  const renderBreadcrumb = () => {
    const steps = {
      'survey-start': 'Bắt đầu khảo sát',
      'pre-survey': 'Khảo sát đầu',
      'course-selection': 'Chọn khóa học',
      'course-learning': 'Học bài',
      'post-survey': 'Khảo sát sau',
      'results': 'Kết quả',
      'consultation-redirect': 'Tư vấn'
    };

    return (
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Home className="h-4 w-4 cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => window.location.href = '/'} />
            <ChevronRight className="h-4 w-4" />
            <span>Khóa học giáo dục</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-blue-600 font-medium">{steps[currentStep]}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render survey start
  const renderSurveyStart = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {renderBreadcrumb()}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Chào mừng đến với <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">Khóa Học Giáo Dục</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Bắt đầu hành trình học tập của bạn với khảo sát đánh giá để chúng tôi có thể đề xuất khóa học phù hợp nhất
            </p>
          </div>

          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Khảo sát đánh giá</h2>
              <p className="text-lg text-gray-600 mb-8">
                Trả lời một số câu hỏi ngắn để chúng tôi hiểu rõ hơn về bạn và đề xuất nội dung học tập phù hợp
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">5-10 phút</h3>
                <p className="text-sm text-gray-600">Thời gian hoàn thành</p>
              </div>
              <div className="text-center p-6 bg-emerald-50 rounded-2xl">
                <Target className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Cá nhân hóa</h3>
                <p className="text-sm text-gray-600">Nội dung phù hợp với bạn</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Chứng chỉ</h3>
                <p className="text-sm text-gray-600">Nhận chứng chỉ khi hoàn thành</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartSurvey}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Play className="h-5 w-5 mr-2" />
                Bắt đầu khảo sát
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render survey
  const renderSurvey = () => {
    const questions = surveyType === 'assist' ? assistQuestions : crafftQuestions;
    const currentQuestion = questions[currentSurveyQuestion];
    const isPostSurvey = currentStep === 'post-survey';

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {renderBreadcrumb()}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {isPostSurvey ? 'Khảo sát sau học' : 'Khảo sát đầu vào'}
                  </h2>
                  <span className="text-lg text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                    {currentSurveyQuestion + 1}/{questions.length}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentSurveyQuestion + 1) / questions.length) * 100}%` }}
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
                      onClick={() => handleSurveyAnswer(option.score)}
                      className="w-full p-6 text-left bg-gray-50 hover:bg-purple-50 rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 transform hover:scale-[1.02] group"
                    >
                      <span className="text-gray-800 font-medium text-lg group-hover:text-purple-700">
                        {option.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {currentSurveyQuestion > 0 && (
                <button
                  onClick={() => setCurrentSurveyQuestion(currentSurveyQuestion - 1)}
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

  // Render consultation redirect
  const renderConsultationRedirect = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {renderBreadcrumb()}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="h-16 w-16 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Cần Tư Vấn Chuyên Sâu
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Dựa trên kết quả khảo sát của bạn, chúng tôi khuyến nghị bạn nên trao đổi trực tiếp với chuyên gia tư vấn 
              để được hỗ trợ phù hợp và hiệu quả nhất.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-red-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <User className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">Tư Vấn Cá Nhân</h3>
                </div>
                <p className="text-gray-600">Gặp gỡ trực tiếp với chuyên gia để được tư vấn riêng biệt</p>
              </div>
              
              <div className="bg-orange-50 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">Đặt Lịch Ngay</h3>
                </div>
                <p className="text-gray-600">Chọn thời gian phù hợp để được tư vấn chuyên nghiệp</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => window.open('/consultation', '_blank')}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Đặt Lịch Tư Vấn Ngay
              </button>
              
              <button
                onClick={() => {
                  setHasConsulted(true);
                  setCurrentStep('course-selection');
                }}
                className="bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition-all duration-300"
              >
                Tôi Đã Tư Vấn, Tiếp Tục Học
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render course selection
  const renderCourseSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {renderBreadcrumb()}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Chọn Khóa Học Phù Hợp
            </h1>
            <p className="text-lg text-gray-600">
              {preSurveyScore < 4 ? 'Khóa học được đề xuất cho bạn' : 
               preSurveyScore === 4 ? 'Bạn có thể chọn khóa học phù hợp hoặc khám phá thêm' :
               'Chọn khóa học bạn muốn học'}
            </p>
            
            {preSurveyScore !== null && (
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                  <span className="text-2xl font-bold text-gray-800">Điểm khảo sát: {preSurveyScore}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {preSurveyScore < 4 && "Mức độ rủi ro thấp - Khóa học cơ bản phù hợp"}
                  {preSurveyScore === 4 && "Mức độ rủi ro trung bình - Nên học khóa chuyên sâu"}
                  {preSurveyScore > 5 && "Mức độ rủi ro cao - Đã được tư vấn"}
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {course.id === recommendedCourse?.id && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Đề xuất
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-emerald-600">{course.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-gray-600">{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      {course.lessons} bài
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCourseSelect(course)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {course.price === 'Miễn phí' ? 'Bắt Đầu Học' : 'Mua Khóa Học'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render course learning
  const renderCourseLearning = () => {
    const currentLesson = selectedCourse.lessons_detail[currentLessonIndex];
    const isLessonCompleted = courseProgress[currentLesson.id];
    const completedLessons = Object.keys(courseProgress).length;
    const totalLessons = selectedCourse.lessons_detail.length;
    const progressPercentage = (completedLessons / totalLessons) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        {renderBreadcrumb()}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Course Header */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{selectedCourse.title}</h1>
                <button
                  onClick={() => setCurrentStep('course-selection')}
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
              {/* Lesson Sidebar */}
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
                            setCurrentLessonIndex(index);
                            setVideoWatched(courseProgress[lesson.id] || false);
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
                              index === currentLessonIndex ? 'text-purple-700' :
                              courseProgress[lesson.id] ? 'text-green-700' : 'text-gray-500'
                            }`}>
                              Bài {lesson.id}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                        </div>
                        <p className={`text-xs mt-1 ${
                          index === currentLessonIndex ? 'text-purple-600' :
                          courseProgress[lesson.id] ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {lesson.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  {/* Video Section */}
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
                          onClick={handleVideoPlay}
                          className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-6 transition-all duration-300 transform hover:scale-110"
                        >
                          <Play className="h-12 w-12 text-purple-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Lesson Content */}
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
                          onClick={handleLessonComplete}
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

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          if (currentLessonIndex > 0) {
                            setCurrentLessonIndex(currentLessonIndex - 1);
                            setVideoWatched(courseProgress[selectedCourse.lessons_detail[currentLessonIndex - 1].id]);
                          }
                        }}
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
                        onClick={() => {
                          if (currentLessonIndex < totalLessons - 1 && videoWatched) {
                            setCurrentLessonIndex(currentLessonIndex + 1);
                            setVideoWatched(false);
                          }
                        }}
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

  // Render results
  const renderResults = () => {
    const improvement = preSurveyScore - postSurveyScore;
    const completedLessons = Object.keys(courseProgress).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        {renderBreadcrumb()}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trophy className="h-16 w-16 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Chúc Mừng Bạn Đã Hoàn Thành!
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Bạn đã học xong khóa học "{selectedCourse?.title}" và hoàn thành đánh giá sau học.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Điểm Trước</h3>
                  <p className="text-3xl font-bold text-blue-600">{preSurveyScore}</p>
                </div>
                
                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Điểm Sau</h3>
                  <p className="text-3xl font-bold text-green-600">{postSurveyScore}</p>
                </div>
                
                <div className="bg-purple-50 rounded-2xl p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Cải Thiện</h3>
                  <p className={`text-3xl font-bold ${improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {improvement >= 0 ? '+' : ''}{improvement}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Thống Kê Học Tập</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">{completedLessons}</p>
                    <p className="text-gray-600">Bài học hoàn thành</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{selectedCourse?.duration}</p>
                    <p className="text-gray-600">Thời gian học</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Đánh Giá Kết Quả</h3>
                <div className={`p-6 rounded-2xl ${
                  improvement > 0 ? 'bg-green-50 border border-green-200' :
                  improvement === 0 ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-red-50 border border-red-200'
                }`}>
                  <p className={`text-lg ${
                    improvement > 0 ? 'text-green-700' :
                    improvement === 0 ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {improvement > 0 && 
                      `Tuyệt vời! Bạn đã có tiến bộ rõ rệt với ${improvement} điểm cải thiện. Kiến thức về phòng chống tệ nạn xã hội của bạn đã được nâng cao đáng kể.`}
                    {improvement === 0 && 
                      "Bạn đã duy trì được mức độ hiểu biết ổn định. Hãy tiếp tục áp dụng những kiến thức đã học vào thực tế."}
                    {improvement < 0 && 
                      "Có vẻ như bạn cần ôn tập lại một số nội dung. Đừng lo lắng, hãy xem lại các bài học hoặc tham gia tư vấn thêm."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={restartSurvey}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Học Khóa Khác
                </button>
                
                <button
                  onClick={() => window.open('/certificate', '_blank')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <Award className="h-5 w-5 mr-2" />
                  Tải Chứng Chỉ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="font-sans antialiased">
      {currentStep === 'survey-start' && renderSurveyStart()}
      {(currentStep === 'pre-survey' || currentStep === 'post-survey') && renderSurvey()}
      {currentStep === 'consultation-redirect' && renderConsultationRedirect()}
      {currentStep === 'course-selection' && renderCourseSelection()}
      {currentStep === 'course-learning' && renderCourseLearning()}
      {currentStep === 'results' && renderResults()}
    </div>
  );
};

export default EducationCoursesPage;