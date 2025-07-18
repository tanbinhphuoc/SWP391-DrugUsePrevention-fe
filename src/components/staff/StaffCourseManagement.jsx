"use client";

import React from "react";
import { Search, Edit2, Trash2, Plus, BookOpen, Users, DollarSign, Filter, RefreshCw, X, Video } from "lucide-react";
import { toast } from "react-toastify";
import VideoModal from "./VideoModal";
import ViewVideosModal from "./ViewVideosModal";

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-red-600 p-4 bg-red-50 border border-red-200 rounded-lg m-4">
                    <h3 className="font-semibold">Đã xảy ra lỗi:</h3>
                    <p>{this.state.error?.message || "Lỗi không xác định"}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

class StaffCourseManagement extends React.Component {
    state = {
        courses: [],
        searchTerm: "",
        typeFilter: "",
        statusFilter: "",
        isModalOpen: false,
        isVideoModalOpen: false,
        isViewVideosModalOpen: false,
        selectedCourseID: null,
        formData: {
            courseID: null,
            courseName: "",
            description: "",
            status: "Open",
            type: "HocSinh",
            ageMin: 12,
            ageMax: 18,
            capacity: null,
            price: 0,
            category: "",
        },
        loading: false,
        modalLoading: false,
        error: null,
    };

    fetchCourses = async () => {
        this.setState({ loading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Vui lòng đăng nhập.");
            const response = await fetch("http://localhost:7092/api/Course/GetAllCourse", {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error(`Lấy khóa học thất bại. Mã: ${response.status}`);
            const data = await response.json();
            if (!data.success || !data.data) throw new Error(data.message || "Phản hồi API không hợp lệ.");
            this.setState({
                courses: data.data
                    .filter((course) => !course.isDeleted)
                    .map((course) => ({
                        ...course,
                        type: course.type.trim(),
                        category: course.category || "Chưa phân loại",
                    })),
                loading: false,
            });
        } catch (err) {
            this.setState({ error: err.message, loading: false });
            toast.error(err.message || "Lỗi tải khóa học.");
        }
    };

    componentDidMount() {
        this.fetchCourses();
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "price" && value !== "" && (Number(value) < 0 || isNaN(Number(value)))) {
            this.setState({ error: "Giá phải là số dương." });
            return;
        }
        if (name === "capacity" && value !== "" && Number(value) < 0) {
            this.setState({ error: "Sức chứa phải là số dương." });
            return;
        }
        this.setState((prevState) => ({
            formData: {
                ...prevState.formData,
                [name]: name === "capacity" || name === "price" ? (value !== "" ? Number(value) : null) : value,
                ...(name === "type" && {
                    ageMin: value === "HocSinh" ? 12 : value === "SinhVien" ? 19 : 26,
                    ageMax: value === "HocSinh" ? 18 : value === "SinhVien" ? 25 : 200,
                }),
            },
            error: null,
        }));
    };

    validateForm = () => {
        const { formData } = this.state;
        const requiredFields = {
            courseName: "Tên khóa học",
            price: "Giá",
        };
        for (const [field, label] of Object.entries(requiredFields)) {
            if (!formData[field]) {
                this.setState({ error: `Vui lòng điền ${label} hợp lệ.` });
                return false;
            }
            if (typeof formData[field] === "number" && formData[field] < 0) {
                this.setState({ error: `${label} phải là số không âm.` });
                return false;
            }
        }
        return true;
    };

    handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!this.validateForm()) return;
        this.setState({ modalLoading: true, error: null });
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
                body: JSON.stringify(this.state.formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Tạo khóa học thất bại. Mã: ${response.status}`);
            await this.fetchCourses();
            this.closeModal();
            toast.success("Tạo khóa học thành công!");
        } catch (err) {
            this.setState({ error: err.message, modalLoading: false });
            toast.error(err.message || "Lỗi tạo khóa học.");
        }
    };

    handleSaveUpdate = async (e) => {
        e.preventDefault();
        if (!this.validateForm()) return;
        this.setState({ modalLoading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token xác thực.");
            const response = await fetch(`http://localhost:7092/api/Course/UpdateCourse?id=${this.state.formData.courseID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(this.state.formData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Cập nhật khóa học thất bại. Mã: ${response.status}`);
            await this.fetchCourses();
            this.closeModal();
            toast.success("Cập nhật khóa học thành công!");
        } catch (err) {
            this.setState({ error: err.message, modalLoading: false });
            toast.error(err.message || "Lỗi cập nhật khóa học.");
        }
    };

    handleCategorizeCourse = async (courseID, category) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token xác thực.");
            const response = await fetch(`http://localhost:7092/api/Course/CategorizeCourse?courseId=${courseID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(category),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Phân loại khóa học thất bại. Mã: ${response.status}`);
            await this.fetchCourses();
            toast.success("Phân loại khóa học thành công!");
        } catch (err) {
            toast.error(err.message || "Lỗi phân loại khóa học.");
        }
    };

    handleDelete = async (courseID) => {
        if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;
        this.setState({ loading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Không tìm thấy token xác thực.");
            const response = await fetch(`http://localhost:7092/api/Course/DeleteCourse?id=${courseID}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Xóa khóa học thất bại. Mã: ${response.status}`);
            this.setState((prevState) => ({
                courses: prevState.courses.filter((course) => course.courseID !== courseID),
                loading: false,
            }));
            toast.success("Xóa khóa học thành công!");
        } catch (err) {
            this.setState({ error: err.message, loading: false });
            toast.error(err.message || "Lỗi xóa khóa học.");
        }
    };

    openModal = (course = null) => {
        this.setState({
            formData: course
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
                    category: "",
                },
            isModalOpen: true,
            error: null,
        });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false, modalLoading: false, error: null });
    };

    handleSearch = (e) => this.setState({ searchTerm: e.target.value });
    handleTypeFilter = (e) => this.setState({ typeFilter: e.target.value });
    handleStatusFilter = (e) => this.setState({ statusFilter: e.target.value });

    render() {
        const { courses, searchTerm, typeFilter, statusFilter, isModalOpen, isVideoModalOpen, isViewVideosModalOpen, selectedCourseID, formData, loading, modalLoading, error } = this.state;

        const filteredCourses = courses.filter(
            (course) =>
                course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (typeFilter ? course.type === typeFilter : true) &&
                (statusFilter ? course.status === statusFilter : true),
        );

        return (
            <ErrorBoundary>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Danh sách khóa học</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={this.fetchCourses}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                                <span>Làm mới</span>
                            </button>
                            <button
                                onClick={() => this.openModal()}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm khóa học
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={this.handleSearch}
                                placeholder="Tìm kiếm khóa học..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={typeFilter}
                                onChange={this.handleTypeFilter}
                                className="w-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Tất cả loại</option>
                                <option value="HocSinh">Học sinh (12-18)</option>
                                <option value="SinhVien">Sinh viên (19-25)</option>
                                <option value="PhuHuynh">Phụ huynh (26-200)</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={this.handleStatusFilter}
                                className="w-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="Open">Mở</option>
                                <option value="CLOSED">Đóng</option>
                                <option value="PENDING">Chờ</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-red-800">{error}</span>
                                <button
                                    onClick={this.fetchCourses}
                                    className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-100 transition-colors"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center gap-3 text-gray-600">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Đang tải khóa học...</span>
                            </div>
                        </div>
                    )}

                    {!loading && filteredCourses.length === 0 && (
                        <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border-0">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy khóa học</h3>
                            <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc tạo khóa học mới</p>
                            <button
                                onClick={() => this.openModal()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Tạo khóa học đầu tiên
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <div
                                key={course.courseID}
                                className="group bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border-0 hover:shadow-lg hover:bg-white transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                                                {course.courseName}
                                            </h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                {course.description || "Không có mô tả"}
                                            </p>
                                        </div>
                                        <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 ml-3" />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                    <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${
                            course.type === "HocSinh"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : course.type === "SinhVien"
                                    ? "bg-purple-100 text-purple-800 border-purple-200"
                                    : "bg-orange-100 text-orange-800 border-orange-200"
                        }`}
                    >
                      {course.type}
                    </span>
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full border ${
                                                course.status === "Open" || course.status === "OPEN"
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : course.status === "PENDING"
                                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                        : "bg-red-100 text-red-800 border-red-200"
                                            }`}
                                        >
                      {course.status}
                    </span>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">
                      {course.category}
                    </span>
                                    </div>
                                    <div className="space-y-2 text-sm mb-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span>
                        Tuổi: {course.ageMin}-{course.ageMax === 200 ? "+" : course.ageMax}
                      </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="font-medium text-green-700">{course.price?.toLocaleString()} VNĐ</span>
                                        </div>
                                        {course.capacity && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="w-4 h-4" />
                                                <span>Sức chứa: {course.capacity} người</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                        <button
                                            onClick={() => this.setState({ selectedCourseID: course.courseID, isVideoModalOpen: true })}
                                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => this.setState({ selectedCourseID: course.courseID, isViewVideosModalOpen: true })}
                                            className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
                                        >
                                            <Video className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => this.openModal(course)}
                                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => this.handleDelete(course.courseID)}
                                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {formData.courseID ? "Cập nhật khóa học" : "Thêm khóa học mới"}
                                    </h3>
                                    <button
                                        onClick={this.closeModal}
                                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                                    <form
                                        onSubmit={formData.courseID ? this.handleSaveUpdate : this.handleCreateCourse}
                                        className="p-6 space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Tên khóa học <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    id="courseName"
                                                    name="courseName"
                                                    value={formData.courseName}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Nhập tên khóa học"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Mô tả
                                                </label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Nhập mô tả khóa học"
                                                    rows="3"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Loại khóa học
                                                </label>
                                                <select
                                                    id="type"
                                                    name="type"
                                                    value={formData.type}
                                                    onChange={this.handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                >
                                                    <option value="HocSinh">Học sinh (12-18)</option>
                                                    <option value="SinhVien">Sinh viên (19-25)</option>
                                                    <option value="PhuHuynh">Phụ huynh (26-200)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Trạng thái
                                                </label>
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={this.handleInputChange}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                >
                                                    <option value="Open">Mở</option>
                                                    <option value="CLOSED">Đóng</option>
                                                    <option value="PENDING">Chờ</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Sức chứa
                                                </label>
                                                <input
                                                    id="capacity"
                                                    name="capacity"
                                                    type="number"
                                                    value={formData.capacity || ""}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Số lượng học viên tối đa"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Giá (VNĐ) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    id="price"
                                                    name="price"
                                                    type="number"
                                                    value={formData.price || ""}
                                                    onChange={this.handleInputChange}
                                                    placeholder="0"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Danh mục
                                                </label>
                                                <input
                                                    id="category"
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={this.handleInputChange}
                                                    placeholder="Nhập danh mục khóa học"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        {error && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <p className="text-red-800 text-sm">{error}</p>
                                            </div>
                                        )}
                                        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                                            <button
                                                type="button"
                                                onClick={this.closeModal}
                                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                                disabled={modalLoading}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                        onClose={() => this.setState({ isVideoModalOpen: false })}
                        courseId={selectedCourseID}
                        onSave={this.fetchCourses}
                    />

                    <ViewVideosModal
                        isOpen={isViewVideosModalOpen}
                        onClose={() => this.setState({ isViewVideosModalOpen: false })}
                        courseId={selectedCourseID}
                    />
                </div>
            </ErrorBoundary>
        );
    }
}

export default StaffCourseManagement;