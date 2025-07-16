// ViewVideosModal.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, RefreshCw, Video } from "lucide-react"; // Thêm missing imports

const ViewVideosModal = ({ isOpen, onClose, courseId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && courseId) {
      setLoading(true);
      setError(null);
      setVideos([]);  // Reset videos khi fetch mới
      
      const fetchVideos = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Vui lòng đăng nhập.");
          }
          
          const parsedCourseId = parseInt(courseId);  // Đảm bảo courseId là number
          if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
            throw new Error("ID khóa học không hợp lệ.");
          }
          
          console.log("Fetching videos for courseId:", parsedCourseId); // Debug log
          
          const response = await fetch(`http://localhost:7092/api/CourseVideo/GetByCourse/${parsedCourseId}`, {
            method: 'GET', // Explicitly set method
            headers: { 
              "Content-Type": "application/json", 
              Authorization: `Bearer ${token}` 
            },
          });
          
          console.log("Response status:", response.status); // Debug log
          console.log("Response headers:", response.headers); // Debug log
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("Response error:", errorText); // Debug log
            throw new Error(`Lấy video thất bại. Mã: ${response.status} - ${errorText}`);
          }
          
          const data = await response.json();
          console.log("API Response:", data);  // Debug: Xem full response
          
          if (data.success) {
            const videoList = data.data || [];
            setVideos(videoList);  // Set videos từ data.data
            console.log("Set videos:", videoList);  // Debug: Xem videos sau set
            
            if (videoList.length === 0) {
              toast.info("Khóa học này chưa có video nào.");
            } else {
              toast.success(`Đã tải ${videoList.length} video thành công.`);
            }
          } else {
            throw new Error(data.message || "API trả về không thành công.");
          }
        } catch (err) {
          console.error("Fetch error:", err);  // Debug error
          setError(err.message);
          toast.error(err.message || "Lỗi tải video.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchVideos();
    }
  }, [isOpen, courseId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVideos([]);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <h3 className="text-xl font-semibold text-gray-900">
            Danh sách video {courseId && `(ID: ${courseId})`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
            aria-label="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-3 text-gray-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Đang tải video...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-100 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có video</h3>
              <p className="text-gray-600">Thêm video mới để hiển thị nội dung.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video, index) => (
                <div key={video.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 flex-1">
                      {video.title || `Video ${index + 1}`}
                    </h4>
                    {video.id && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ID: {video.id}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {video.description || "Không có mô tả"}
                  </p>
                  {video.videoUrl && (
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                    >
                      <Video className="w-4 h-4" />
                      Xem video
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewVideosModal;