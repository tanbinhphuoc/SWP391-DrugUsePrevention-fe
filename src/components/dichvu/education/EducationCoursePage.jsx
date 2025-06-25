import React, { useState } from 'react';

import SurveyStart from './SurveyStart';
import SurveyQuestion from './SurveyQuestion';
import CourseSelection from './CourseSelection';
import CourseLearning from './CourseLearning';
import ConsultationRedirect from './ConsultationRedirect';
import Results from './Results';
import { coursesData } from './data/coursesData';
import { assistQuestions } from './data/assistQuestions';
import  crafftQuestions  from './data/crafftQuestions';

const EducationCoursesPage = ({ userAgeGroup = 'student' }) => {
  const [currentStep, setCurrentStep] = useState('survey-start');
  const [surveyAnswers, setSurveyAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});
  const [videoWatched, setVideoWatched] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [postSurveyAnswers, setPostSurveyAnswers] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const isPostSurvey = currentStep === 'post-survey';
  const questions = isPostSurvey ? crafftQuestions : assistQuestions;

  const handleAnswer = (score) => {
    const updatedAnswers = isPostSurvey
      ? [...postSurveyAnswers, score]
      : [...surveyAnswers, score];

    isPostSurvey ? setPostSurveyAnswers(updatedAnswers) : setSurveyAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setCurrentQuestionIndex(0);
      const next = isPostSurvey
        ? 'results'
        : getPreSurveyScore(updatedAnswers) >= 5
        ? 'consultation-redirect'
        : 'course-selection';
      setCurrentStep(next);
    }
  };

  const handleBack = () => {
    setCurrentQuestionIndex((i) => Math.max(0, i - 1));
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setCurrentStep('course-learning');
    setCourseProgress({});
    setCurrentLessonIndex(0);
  };

  const handleCompleteLesson = () => {
    const id = selectedCourse.lessons_detail[currentLessonIndex].id;
    setCourseProgress((prev) => ({ ...prev, [id]: true }));
    setVideoWatched(false);
    setIsVideoPlaying(false);
  };

  const handleNavigateLesson = (index) => {
    if (index === 'backToSelection') return setCurrentStep('course-selection');
    if (typeof index === 'number') {
      setCurrentLessonIndex(index);
      setVideoWatched(!!courseProgress[selectedCourse.lessons_detail[index].id]);
    }
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    setTimeout(() => setVideoWatched(true), 5000); // giả lập video xem xong
  };

  const getPreSurveyScore = (answers) => answers.reduce((sum, s) => sum + s, 0);
  const getPostSurveyScore = () => postSurveyAnswers.reduce((sum, s) => sum + s, 0);

  const restart = () => {
    setCurrentStep('survey-start');
    setSurveyAnswers([]);
    setPostSurveyAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedCourse(null);
    setCourseProgress({});
    setCurrentLessonIndex(0);
  };

  const recommendedCourse = coursesData[userAgeGroup];
  const availableCourses = Object.values(coursesData);
  const preSurveyScore = getPreSurveyScore(surveyAnswers);
  const postSurveyScore = getPostSurveyScore();

  switch (currentStep) {
    case 'survey-start':
      return <SurveyStart onStart={() => setCurrentStep('pre-survey')} currentStep={currentStep} />;

    case 'pre-survey':
    case 'post-survey':
      return (
        <SurveyQuestion
          currentStep={currentStep}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      );

    case 'consultation-redirect':
      return (
        <ConsultationRedirect
          currentStep={currentStep}
          onContinue={() => setCurrentStep('course-selection')}
        />
      );

    case 'course-selection':
      return (
        <CourseSelection
          currentStep={currentStep}
          preSurveyScore={preSurveyScore}
          recommendedCourse={recommendedCourse}
          availableCourses={availableCourses}
          onSelectCourse={handleSelectCourse}
        />
      );

    case 'course-learning':
      return (
        <CourseLearning
          currentStep={currentStep}
          selectedCourse={selectedCourse}
          currentLessonIndex={currentLessonIndex}
          courseProgress={courseProgress}
          videoWatched={videoWatched}
          isVideoPlaying={isVideoPlaying}
          onPlayVideo={handlePlayVideo}
          onCompleteLesson={handleCompleteLesson}
          onNavigateLesson={handleNavigateLesson}
        />
      );

    case 'results':
      return (
        <Results
          currentStep={currentStep}
          selectedCourse={selectedCourse}
          courseProgress={courseProgress}
          preSurveyScore={preSurveyScore}
          postSurveyScore={postSurveyScore}
          onRestart={restart}
        />
      );

    default:
      return null;
  }
};

export default EducationCoursesPage;
