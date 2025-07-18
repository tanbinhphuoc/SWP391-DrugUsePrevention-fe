"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, RefreshCw, Video } from "lucide-react";

const ViewVideosModal = ({ isOpen, onClose, courseId }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && courseId) {
            setLoading(true);
            setError(null);
            setVideos([]);

            const fetchVideos = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("Vui lòng đăng nhập.");

                    const parsedCourseId = parseInt(courseId);
                    if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
                        throw new Error("ID khóa học không hợp lệ.");
                    }

                    const response = await fetch(`http://localhost:7092/api/CourseVideo/GetByCourse/${parsedCourseId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Lấy video thất bại. Mã: ${response.status} - ${errorText}`);
                    }

                    const data = await response.json();
                    if (data.success) {
                        const videoList = data.data || [];
                        setVideos(videoList);
                        if (videoList.length === 0) {
                            toast.info("Chưa có video cho khóa học này.");
                        } else {
                            toast.success(`Đã tải ${videoList.length} video.`);
                        }
                    } else {
                        throw new Error(data.message || "Dữ liệu không hợp lệ.");
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchVideos();
        }
    }, [isOpen, courseId]);

    useEffect(() => {
        if (!isOpen) {
            setVideos([]);
            setError(null);
            setLoading(false);
        }
    }, [isOpen]);

    const handleRefresh = () => {
        setLoading(true);
        setError(null);
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Vui lòng đăng nhập.");

                const parsedCourseId = parseInt(courseId);
                if (isNaN(parsedCourseId) || parsedCourseId <= 0) {
                    throw new Error("ID khóa học không hợp lệ.");
                }

                const response = await fetch(`http://localhost:7092/api/CourseVideo/GetByCourse/${parsedCourseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Lấy video thất bại. Mã: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                if (data.success) {
                    const videoList = data.data || [];
                    setVideos(videoList);
                    if (videoList.length === 0) {
                        toast.info("Chưa có video cho khóa học này.");
                    } else {
                        toast.success(`Đã tải ${videoList.length} video.`);
                    }
                } else {
                    throw new Error(data.message || "Dữ liệu không hợp lệ.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-purple-100 to-purple-200 border-b border-purple-300">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Danh sách video {courseId && `(ID: ${courseId})`}
                    </h3>
                    <div>
                        <button
                            onClick={handleRefresh}
                            className="mr-2 text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
                            disabled={loading}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
                            aria-label="Đóng"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
              <span className="flex items-center gap-2 text-gray-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Đang tải...
              </span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <p className="text-red-700 text-sm">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="mt-2 px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="text-center py-12">
                            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">Chưa có video</h3>
                            <p className="text-gray-500">Thêm video để bắt đầu!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {videos.map((video, index) => (
                                <div
                                    key={video.id || index}
                                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-semibold text-gray-800">
                                            {video.title || `Video ${index + 1}`}
                                        </h4>
                                        {video.id && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        ID: {video.id}
                      </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {video.description || "Không có mô tả"}
                                    </p>
                                    {video.videoUrl && (
                                        <a
                                            href={video.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 hover:underline"
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
                <div className="flex justify-end gap-4 p-6 bg-gray-50 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewVideosModal;