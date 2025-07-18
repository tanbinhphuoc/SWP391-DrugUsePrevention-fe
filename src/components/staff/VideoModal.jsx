"use client";

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

    // Cập nhật courseID khi mở modal
    useEffect(() => {
        if (isOpen && courseId) {
            setVideoFormData((prev) => ({
                ...prev,
                courseID: courseId,
            }));
            setError(null);
        }
    }, [isOpen, courseId]);

    // Reset form khi đóng modal
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
            if (!videoFormData[field].trim()) {
                setError(`Vui lòng điền ${label} hợp lệ.`);
                return false;
            }
        }
        if (!videoFormData.courseID || videoFormData.courseID <= 0) {
            setError("Khóa học không hợp lệ.");
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
            if (!token) throw new Error("Vui lòng đăng nhập để tiếp tục.");

            const requestBody = {
                ...videoFormData,
                courseID: Number(videoFormData.courseID),
            };

            const response = await fetch("http://localhost:7092/api/CourseVideo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Thêm video thất bại.");

            setVideoFormData({
                courseID: courseId,
                title: "",
                videoUrl: "",
                description: "",
            });

            onClose();
            onSave();
            toast.success("Thêm video thành công!");
        } catch (err) {
            setError(err.message);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-100 to-green-200 border-b border-green-300">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Thêm video cho khóa học {courseId && `(ID: ${courseId})`}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full p-2 transition-colors"
                        aria-label="Đóng"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                    <form onSubmit={handleAddVideo} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề video <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    value={videoFormData.title}
                                    onChange={handleVideoInputChange}
                                    placeholder="Nhập tiêu đề video"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                    URL video <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="videoUrl"
                                    name="videoUrl"
                                    value={videoFormData.videoUrl}
                                    onChange={handleVideoInputChange}
                                    placeholder="Nhập URL video (ví dụ: YouTube embed link)"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả video
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={videoFormData.description}
                                    onChange={handleVideoInputChange}
                                    placeholder="Nhập mô tả video"
                                    rows="4"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}
                    </form>
                </div>
                <div className="flex justify-end gap-4 p-6 bg-gray-50 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        disabled={modalLoading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        onClick={handleAddVideo}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        disabled={modalLoading}
                    >
                        {modalLoading && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        )}
                        <span>{modalLoading ? "Đang xử lý..." : "Thêm video"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;