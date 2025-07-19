"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Edit2, Trash2, Plus, BookOpen, Users, DollarSign, Filter, RefreshCw, X, Video } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoModal from "./VideoModal";
import ViewVideosModal from "./ViewVideosModal";

const StaffCourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isViewVideosModalOpen, setIsViewVideosModalOpen] = useState(false);
    const [selectedCourseID, setSelectedCourseID] = useState(null);
    const [formData, setFormData] = useState({
        courseID: null,
        courseName: "",
        description: "",
        status: "Open",
        type: "HocSinh",
        ageMin: 12,
        ageMax: 18,
        capacity: null,
        price: 0,
    });
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Vui lòng đăng nhập.");
            const response = await fetch("http://localhost:7092/api/Course/GetAllCourse", {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`Lấy khóa học thất bại. Mã: ${response.status}`);
            const data = await response.json();
            if (!data.success || !data.data) throw new Error(data.message || "Phản hồi API không hợp lệ.");
            setCourses(
                data.data
                    .filter((course) => !course.isDeleted)
                    .map((course) => ({
                        ...course,
                        type: course.type.trim(),
                    }))
            );
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            toast.error(err.message || "Lỗi tải khóa học.");
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "price" && value !== "" && (Number(value) < 0 || isNaN(Number(value)))) {
            setError("Giá phải là số dương.");
            return;
        }
        if (name === "capacity" && value !== "" && Number(value) < 0) {
            setError("Sức chứa phải là số dương.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: name === "capacity" || name === "price" ? (value !== "" ? Number(value) : null) : value,
            ...(name === "type" && {
                ageMin: value === "HocSinh" ? 12 : value === "SinhVien" ? 19 : 26,
                ageMax: value === "HocSinh" ? 18 : value === "SinhVien" ? 25 : 200,
            }),
        }));
        setError(null);
    };

    const validateForm = () => {
        const requiredFields = {
            courseName: "Tên khóa học",
            price: "Giá",
        };
        for (const [field, label] of Object.entries(requiredFields)) {
            if (!formData[field]) {
                setError(`Vui lòng điền ${label} hợp lệ.`);
                return false;
            }
            if (typeof formData[field] === "number" && formData[field] < 0) {
                setError(`${label} phải là số không âm.`);
                return false;
            }
        }
        return true;
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setModalLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token xác thực.");
            const response = await fetch("http://localhost:7092/api/Course/CreateCourse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "*/*",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Tạo khóa học thất bại. Mã: ${response.status}`);
            await fetchCourses();
            closeModal();
            toast.success("Tạo khóa học thành công!");
        } catch (err) {
            setError(err.message);
            setModalLoading(false);
            toast.error(err.message || "Lỗi tạo khóa học.");
        }
    };

    const handleSaveUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setModalLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token xác thực.");
            const response = await fetch(`http://localhost:7092/api/Course/UpdateCourse?id=${formData.courseID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Cập nhật khóa học thất bại. Mã: ${response.status}`);
            await fetchCourses();
            closeModal();
            toast.success("Cập nhật khóa học thành công!");
        } catch (err) {
            setError(err.message);
            setModalLoading(false);
            toast.error(err.message || "Lỗi cập nhật khóa học.");
        }
    };

    const handleDelete = async (courseID) => {
        if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token xác thực.");
            const response = await fetch(`http://localhost:7092/api/Course/DeleteCourse?id=${courseID}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Xóa khóa học thất bại. Mã: ${response.status}`);
            setCourses((prev) => prev.filter((course) => course.courseID !== courseID));
            setLoading(false);
            toast.success("Xóa khóa học thành công!");
        } catch (err) {
            setError(err.message);
            setLoading(false);
            toast.error(err.message || "Lỗi xóa khóa học.");
        }
    };

    const openModal = (course = null) => {
        setFormData(
            course
                ? { ...course }
                : {
                    courseID: null,
                    courseName: "",
                    description: "",
                    status: "Open",
                    type: "HocSinh",
                    ageMin: 12,
                    ageMax: 18,
                    capacity: null,
                    price: 0,
                }
        );
        setIsModalOpen(true);
        setError(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalLoading(false);
        setError(null);
    };

    const filteredCourses = courses.filter(
        (course) =>
            course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (typeFilter ? course.type === typeFilter : true) &&
            (statusFilter ? course.status === statusFilter : true)
    );

    return (
        <div className="bg-gradient-to-br from-white/95 via-blue-50 to-indigo-100 p-6 rounded-2xl shadow-xl border border-slate-200">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quản lý khóa học
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={fetchCourses}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        <span>Làm mới</span>
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        Thêm khóa học
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm khóa học..."
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-48 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                    >
                        <option value="">Tất cả loại</option>
                        <option value="HocSinh">Học sinh (12-18)</option>
                        <option value="SinhVien">Sinh viên (19-25)</option>
                        <option value="PhuHuynh">Phụ huynh (26-200)</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-48 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Open">Mở</option>
                        <option value="CLOSED">Đóng</option>
                        <option value="PENDING">Chờ</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <span className="text-red-800">{error}</span>
                        <button
                            onClick={fetchCourses}
                            className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-all"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="flex items-center gap-3 text-slate-600">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Đang tải khóa học...</span>
                    </div>
                </div>
            )}

            {!loading && filteredCourses.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Không tìm thấy khóa học</h3>
                    <p className="text-slate-600 mb-4">Thử thay đổi bộ lọc hoặc tạo khóa học mới</p>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo khóa học đầu tiên
                    </button>
                </div>
            )}

            {!loading && filteredCourses.length > 0 && (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="w-full text-left border-collapse bg-white">
                        <thead className="bg-gradient-to-r from-blue-100 to-indigo-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-800">Tên khóa học</th>
                            <th className="p-4 text-sm font-semibold text-slate-800">Loại</th>
                            <th className="p-4 text-sm font-semibold text-slate-800">Trạng thái</th>
                            <th className="p-4 text-sm font-semibold text-slate-800">Sức chứa</th>
                            <th className="p-4 text-sm font-semibold text-slate-800">Giá (VNĐ)</th>
                            <th className="p-4 text-sm font-semibold text-slate-800">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCourses.map((course) => (
                            <tr
                                key={course.courseID}
                                className="border-b border-slate-200 hover:bg-slate-50 transition-all duration-200"
                            >
                                <td className="p-4 text-sm text-slate-700">{course.courseName}</td>
                                <td className="p-4 text-sm text-slate-700">
                                    {course.type === "HocSinh"
                                        ? "Học sinh"
                                        : course.type === "SinhVien"
                                            ? "Sinh viên"
                                            : "Phụ huynh"}
                                </td>
                                <td className="p-4 text-sm">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            course.status === "Open"
                                ? "bg-green-100 text-green-800"
                                : course.status === "CLOSED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {course.status}
                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-700">{course.capacity || "Không giới hạn"}</td>
                                <td className="p-4 text-sm text-slate-700">
                                    {course.price.toLocaleString("vi-VN")}
                                </td>
                                <td className="p-4 text-sm flex gap-2">
                                    <button
                                        onClick={() => openModal(course)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course.courseID)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedCourseID(course.courseID);
                                            setIsVideoModalOpen(true);
                                        }}
                                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all duration-200"
                                        title="Thêm video"
                                    >
                                        <Video className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedCourseID(course.courseID);
                                            setIsViewVideosModalOpen(true);
                                        }}
                                        className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all duration-200"
                                        title="Xem video"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-100">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {formData.courseID ? "Cập nhật khóa học" : "Thêm khóa học mới"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-all duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
                            <form
                                onSubmit={formData.courseID ? handleSaveUpdate : handleCreateCourse}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="courseName"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Tên khóa học <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="courseName"
                                            name="courseName"
                                            value={formData.courseName}
                                            onChange={handleInputChange}
                                            placeholder="Nhập tên khóa học"
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Mô tả
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Nhập mô tả khóa học"
                                            rows="3"
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                                            Loại khóa học
                                        </label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                                        >
                                            <option value="HocSinh">Học sinh (12-18)</option>
                                            <option value="SinhVien">Sinh viên (19-25)</option>
                                            <option value="PhuHuynh">Phụ huynh (26-200)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Trạng thái
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                                        >
                                            <option value="Open">Mở</option>
                                            <option value="CLOSED">Đóng</option>
                                            <option value="PENDING">Chờ</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="capacity"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Sức chứa
                                        </label>
                                        <input
                                            id="capacity"
                                            name="capacity"
                                            type="number"
                                            value={formData.capacity || ""}
                                            onChange={handleInputChange}
                                            placeholder="Số lượng học viên tối đa"
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="block text-sm font-medium text-slate-700 mb-2"
                                        >
                                            Giá (VNĐ) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={formData.price || ""}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-md">
                                        <p className="text-red-800 text-sm">{error}</p>
                                    </div>
                                )}
                                <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-all duration-200 disabled:opacity-50"
                                        disabled={modalLoading}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 shadow-md hover:shadow-lg"
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
                                            <span>{formData.courseID ? "Cập nhật" : "Tạo khóa học"}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <VideoModal
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                courseId={selectedCourseID}
                onSave={fetchCourses}
            />

            <ViewVideosModal
                isOpen={isViewVideosModalOpen}
                onClose={() => setIsViewVideosModalOpen(false)}
                courseId={selectedCourseID}
            />
        </div>
    );
};

export default StaffCourseManagement;