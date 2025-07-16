// CourseLearning.jsx (Updated for responsive iframe, back button, complete button, and navigation to output assessment with courseId)
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const CourseLearning = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [videos, setVideos] = useState([]);
  const [outputAssessmentId, setOutputAssessmentId] = useState(null);

  const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`http://localhost:7092/api/CourseVideo/GetByCourse/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setVideos(data.data);
        }
      } catch (error) {
        toast.error("Lỗi tải video khóa học.");
      }
    };
    fetchVideos();
  }, [courseId, token]);

  useEffect(() => {
    const fetchOutputAssessment = async () => {
      try {
        const response = await fetch(`http://localhost:7092/api/Assessment/GetAllOutput`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          const assessment = data.data.find(a => a.courseID === parseInt(courseId));
          if (assessment) {
            setOutputAssessmentId(assessment.assessmentID);
          } else {
            toast.warn("Không tìm thấy bài đánh giá đầu ra cho khóa học này.");
          }
        }
      } catch (error) {
        toast.error("Lỗi tải thông tin bài đánh giá đầu ra.");
      }
    };
    fetchOutputAssessment();
  }, [courseId, token]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleComplete = () => {
    if (outputAssessmentId) {
      navigate(`/output-assessment/${outputAssessmentId}`, { state: { courseId: parseInt(courseId) } }); // Pass courseId via state
    } else {
      toast.error("Không tìm thấy bài đánh giá đầu ra.");
    }
  };

  return (
    <section className="bg-white p-4 rounded shadow">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded"
      >
        Quay lại
      </button>
      <h2 className="text-lg font-semibold mb-2">📘 Học khóa học</h2>
      {videos.length > 0 ? (
        <ul className="space-y-4">
          {videos.map((video, index) => (
            <li key={index} className="p-3 border rounded">
              <h3 className="font-medium">{video.title}</h3>
              <p className="text-sm text-gray-600">{video.description}</p>
              <div className="relative w-full pb-[56.25%] mt-2"> {/* 16:9 aspect ratio */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={video.videoUrl}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Đang tải nội dung...</p>
      )}
      <button
        onClick={handleComplete}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Hoàn thành bài học
      </button>
    </section>
  );
};

export default CourseLearning;