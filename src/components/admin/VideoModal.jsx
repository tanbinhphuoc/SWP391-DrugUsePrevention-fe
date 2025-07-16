import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const VideoModal = ({ isOpen, onClose, courseId, onSave }) => {
  const [videoFormData, setVideoFormData] = useState({
    courseID: null,
    title: "",
    videoUrl: "",
    description: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cập nhật courseID khi courseId prop thay đổi
  useEffect(() => {
    if (isOpen && courseId) {
      setVideoFormData(prev => ({
        ...prev,
        courseID: courseId
      }));
      setError(null); // Reset error khi mở modal mới
    }
  }, [isOpen, courseId]);

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setVideoFormData({
        courseID: null,
        title: "",
        videoUrl: "",
        description: "",
      });
      setError(null);
      setModalLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateVideoForm = () => {
    const requiredFields = {
      title: "Tiêu đề video",
      videoUrl: "URL video",
    };
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!videoFormData[field]) {
        setError(`Vui lòng điền ${label} hợp lệ.`);
        return false;
      }
    }
    if (!videoFormData.courseID || videoFormData.courseID <= 0) {
      setError(`Khóa học không hợp lệ. CourseID: ${videoFormData.courseID}`);
      return false;
    }
    return true;
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!validateVideoForm()) return;
    setModalLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token xác thực.");
      
      const requestBody = {
        ...videoFormData,
        courseID: Number(videoFormData.courseID)
      };
      
      console.log("Sending body:", JSON.stringify(requestBody));
      console.log("Current courseId prop:", courseId);
      console.log("Current videoFormData.courseID:", videoFormData.courseID);
      
      const response = await fetch("http://localhost:7092/api/CourseVideo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Thêm video thất bại. Mã: ${response.status}`);
      
      // Reset form sau khi thành công
      setVideoFormData({
        courseID: courseId,
        title: "",
        videoUrl: "",
        description: "",
      });
      
      onClose();
      onSave();  // Refresh parent
      toast.success("Thêm video thành công");
    } catch (err) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
          <h3 className="text-xl font-semibold text-gray-900">
            Thêm video vào khóa học {courseId && `(ID: ${courseId})`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
            aria-label="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleAddVideo} className="p-6 space-y-6">
            {/* Debug info - có thể xóa sau khi fix */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>CourseId prop: {courseId}</p>
              <p>VideoFormData.courseID: {videoFormData.courseID}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề video <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  value={videoFormData.title}
                  onChange={handleVideoInputChange}
                  placeholder="Nhập tiêu đề video"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL video <span className="text-red-500">*</span>
                </label>
                <input
                  id="videoUrl"
                  name="videoUrl"
                  value={videoFormData.videoUrl}
                  onChange={handleVideoInputChange}
                  placeholder="Nhập URL video (ví dụ: link YouTube embed)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả video
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={videoFormData.description}
                  onChange={handleVideoInputChange}
                  placeholder="Nhập mô tả video"
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                />
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            disabled={modalLoading}
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleAddVideo}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={modalLoading}
          >
            {modalLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              <span>Thêm video</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;