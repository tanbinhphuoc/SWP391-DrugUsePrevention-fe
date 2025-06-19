import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Plus, BookOpen, X } from "lucide-react";

// Error Boundary Component
import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-600 p-4">
          <h3>Đã xảy ra lỗi:</h3>
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

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseID: null,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "COBAN",
    status: "OPEN",
    ageMin: 0,
    ageMax: null,
    capacity: null,
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
      const response = await fetch("https://localhost:7092/api/Course/GetAllCourse", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch courses.");
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchCourses().then(() => {
      if (!mounted) return;
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && value !== "" && (parseInt(value) < 0 || isNaN(parseInt(value)))) {
      setError("Price must be a positive number.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "ageMin" || name === "ageMax" || name === "capacity" || name === "price"
          ? value
            ? parseInt(value)
            : null
          : value,
    }));
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = {
      title: "Tiêu đề (e.g., 'Khóa học tiếng Anh')",
      startDate: "Ngày bắt đầu (e.g., '2025-06-18')",
      endDate: "Ngày kết thúc (e.g., '2025-12-31')",
      ageMin: "Tuổi tối thiểu (e.g., 10)",
      price: "Giá (e.g., 500000)",
    };
    for (const [field, example] of Object.entries(requiredFields)) {
      if (!formData[field] || (typeof formData[field] === "number" && formData[field] < 0)) {
        setError(`Vui lòng điền ${field === "ageMin" || field === "price" ? "giá trị hợp lệ cho" : ""} ${field}: ${example}`);
        return false;
      }
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Ngày kết thúc phải sau ngày bắt đầu.");
      return false;
    }
    return true;
  };

  // Create course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setModalLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
      const response = await fetch("https://localhost:7092/api/Course/CreateCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          type: formData.type,
          status: formData.status,
          ageMin: formData.ageMin,
          ageMax: formData.ageMax,
          capacity: formData.capacity,
          price: formData.price,
        }),
      });
      const data = await response.json();
      console.log("Create response:", data); // Debug log
      if (!response.ok) throw new Error(data.message || "Failed to create course.");
      await fetchCourses(); // Fetch updated list
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Update course
  const handleUpdateCourse = (course) => {
    setFormData({
      courseID: course.courseID,
      title: course.title || "",
      description: course.description || "",
      startDate: course.startDate ? new Date(course.startDate).toISOString().split("T")[0] : "",
      endDate: course.endDate ? new Date(course.endDate).toISOString().split("T")[0] : "",
      type: course.type || "COBAN",
      status: course.status || "OPEN",
      ageMin: course.ageMin || 0,
      ageMax: course.ageMax || null,
      capacity: course.capacity || null,
      price: course.price || 0,
    });
    setIsModalOpen(true);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setModalLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
      const response = await fetch(`https://localhost:7092/api/Course/UpdateCourse?id=${formData.courseID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          type: formData.type,
          status: formData.status,
          ageMin: formData.ageMin,
          ageMax: formData.ageMax,
          capacity: formData.capacity,
          price: formData.price,
        }),
      });
      const data = await response.json();
      console.log("Update response:", data); // Debug log
      if (!response.ok) throw new Error(data.message || "Failed to update course.");
      await fetchCourses(); // Fetch updated list
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Delete course
  const handleDelete = async (courseID) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found.");
      const response = await fetch(`https://localhost:7092/api/Course/DeleteCourse?id=${courseID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Delete response:", data); // Debug log
      if (!response.ok) throw new Error(data.message || "Failed to delete course.");
      await fetchCourses(); // Fetch updated list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      courseID: null,
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      type: "COBAN",
      status: "OPEN",
      ageMin: 0,
      ageMax: null,
      capacity: null,
      price: 0,
    });
    setError(null);
  };

  // Handle search and filters
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleTypeFilter = (e) => setTypeFilter(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);

  const filteredCourses = courses && Array.isArray(courses)
    ? courses.filter(
        (course) =>
          course.title &&
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (typeFilter ? course.type === typeFilter : true) &&
          (statusFilter ? course.status === statusFilter : true)
      )
    : [];

  return (
    <ErrorBoundary>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý khóa học</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            aria-label="Add new course"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khóa học</span>
          </button>
        </div>

        {loading && <p className="text-gray-600">Đang tải...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Search and Filter */}
        <div className="mb-6 flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Tìm kiếm khóa học..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              aria-label="Search courses"
            />
          </div>
          <select
            value={typeFilter}
            onChange={handleTypeFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by type"
          >
            <option value="">Tất cả loại</option>
            <option value="COBAN">Cơ bản</option>
            <option value="NANGCAO">Nâng cao</option>
          </select>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by status"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="OPEN">Mở</option>
            <option value="CLOSED">Đóng</option>
          </select>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 && !loading && <p className="text-gray-600">Không tìm thấy khóa học.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.courseID} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {course.type}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Tuổi: {course.ageMin}-{course.ageMax || "Không giới hạn"}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Giá: {course.price} VNĐ
                      </span>
                    </div>
                  </div>
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === "OPEN" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.status}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateCourse(course)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      aria-label={`Edit course ${course.title}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.courseID)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      aria-label={`Delete course ${course.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Create/Update */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {formData.courseID ? "Cập nhật khóa học" : "Thêm khóa học"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={formData.courseID ? handleSaveUpdate : handleCreateCourse}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tiêu đề (e.g., 'Khóa học tiếng Anh')
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nhập tiêu đề (e.g., 'Khóa học tiếng Anh')"
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Mô tả (e.g., 'Khóa học cơ bản cho người mới')
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả (e.g., 'Khóa học cơ bản cho người mới')"
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Ngày bắt đầu (e.g., '2025-06-18')
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    Ngày kết thúc (e.g., '2025-12-31')
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Loại
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="COBAN">Cơ bản</option>
                    <option value="NANGCAO">Nâng cao</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="OPEN">Mở</option>
                    <option value="CLOSED">Đóng</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="ageMin" className="block text-sm font-medium text-gray-700">
                    Tuổi tối thiểu (e.g., 10)
                  </label>
                  <input
                    id="ageMin"
                    name="ageMin"
                    type="number"
                    value={formData.ageMin}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="ageMax" className="block text-sm font-medium text-gray-700">
                    Tuổi tối đa (e.g., 20)
                  </label>
                  <input
                    id="ageMax"
                    name="ageMax"
                    type="number"
                    value={formData.ageMax || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Sức chứa (e.g., 30)
                  </label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Giá (VNĐ) (e.g., 500000)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    disabled={modalLoading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={modalLoading}
                  >
                    {modalLoading ? "Đang xử lý..." : formData.courseID ? "Cập nhật" : "Tạo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CourseManagement;