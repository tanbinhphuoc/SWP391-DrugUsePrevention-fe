import { useState } from "react";
import { Search, Edit2, Trash2, Plus, BookOpen, Users, Clock, Star, X, Calendar, DollarSign, Award, FileText, ClipboardList } from "lucide-react";
import { toast } from "react-toastify";

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Nhận thức về ma túy cho học sinh",
      category: "Giáo dục cơ bản",
      level: "Cơ bản",
      duration: "4 tuần",
      status: "Đang diễn ra",
      students: 156,
      rating: 4.8,
      instructor: "TS. Nguyễn Văn A",
      createdDate: "2024-01-15",
      lastUpdated: "2024-05-10"
    },
    {
      id: 2,
      title: "Kỹ năng từ chối ma túy",
      category: "Kỹ năng sống",
      level: "Trung cấp",
      duration: "6 tuần",
      status: "Sắp khai giảng",
      students: 89,
      rating: 4.9,
      instructor: "ThS. Trần Thị B",
      createdDate: "2024-02-20",
      lastUpdated: "2024-05-15"
    },
    {
      id: 3,
      title: "Phòng chống ma túy trong trường học",
      category: "Chuyên đề",
      level: "Nâng cao",
      duration: "8 tuần",
      status: "Đã kết thúc",
      students: 234,
      rating: 4.7,
      instructor: "PGS. Lê Văn C",
      createdDate: "2024-01-10",
      lastUpdated: "2024-04-30"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Sắp khai giảng",
    type: "Giáo dục cơ bản",
    ageMin: 0,
    ageMax: 0,
    capacity: 0,
    price: 0
  });

  const [editSurvey, setEditSurvey] = useState({ preSurvey: "", postSurvey: "" });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "" || course.category === filterCategory;
    const matchesStatus = filterStatus === "" || course.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddCourse = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setNewCourse({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Sắp khai giảng",
      type: "Giáo dục cơ bản",
      ageMin: 0,
      ageMax: 0,
      capacity: 0,
      price: 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSurveyChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSurveyChange = (e) => {
    const { name, value } = e.target;
    setEditSurvey(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!newCourse.title || !newCourse.description || !newCourse.startDate || !newCourse.endDate) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    const newId = Math.max(...courses.map(c => c.id)) + 1;
    const courseToAdd = {
      ...newCourse,
      id: newId,
      category: newCourse.type,
      level: "Cơ bản",
      duration: "4 tuần",
      students: 0,
      rating: 0,
      instructor: "Chưa phân công",
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setCourses(prev => [...prev, courseToAdd]);
    toast.success("✅ Đã thêm khóa học mới!");
    handleCloseForm();
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      setCourses(prev => prev.filter(course => course.id !== id));
    }
  };

   const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Xóa không thành công");
      setCourses(prev => prev.filter(course => course.id !== id));
      toast.success("✅ Đã xóa khóa học thành công!");
    } catch (error) {
      toast.error("❌ Xảy ra lỗi khi xóa khóa học!");
    } finally {
      setIsDeleting(false);
      setCourseToDelete(null);
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      const response = await fetch(`/api/courses/${encodeURIComponent(updatedCourse.title)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedCourse)
      });
      if (!response.ok) throw new Error("Cập nhật thất bại");

      setCourses(prev =>
        prev.map(course =>
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      setCourseToEdit(null);
      toast.success("✅ Đã cập nhật khóa học thành công!");
    } catch (error) {
      toast.error("❌ Có lỗi khi cập nhật khóa học!");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-600" />
          Quản lý khóa học
        </h2>
        <button
          onClick={handleAddCourse}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl shadow-lg hover:scale-105 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm khóa học</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
        >
          <option value="">Tất cả danh mục</option>
          <option value="Giáo dục cơ bản">Giáo dục cơ bản</option>
          <option value="Kỹ năng sống">Kỹ năng sống</option>
          <option value="Chuyên đề">Chuyên đề</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang diễn ra">Đang diễn ra</option>
          <option value="Sắp khai giảng">Sắp khai giảng</option>
          <option value="Đã kết thúc">Đã kết thúc</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                      {course.level}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                      {course.duration}
                    </span>
                  </div>
                </div>
                <BookOpen className="w-7 h-7 text-blue-500 flex-shrink-0" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{course.students} học viên</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>{course.rating}/5.0</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Cập nhật: {course.lastUpdated}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Giảng viên: {course.instructor}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                  course.status === "Đang diễn ra"
                    ? "bg-green-100 text-green-800"
                    : course.status === "Sắp khai giảng"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {course.status}
                </span>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={() => {
                      setCourseToEdit(course);
                      setEditSurvey({
                        preSurvey: course.preSurvey || "",
                        postSurvey: course.postSurvey || ""
                      });
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCourseToDelete(course)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Xác Nhận Xóa */}
      {courseToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Xác nhận xóa khóa học</h3>
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn xóa <strong>{courseToDelete.title}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleConfirmDelete(courseToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Đang xóa..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chỉnh sửa */}
      {courseToEdit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-blue-600" />
              Chỉnh sửa khóa học
            </h3>
            <label className="block text-sm font-medium text-gray-700">Tên khóa học</label>
            <input
              type="text"
              value={courseToEdit.title}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <label className="block text-sm font-medium text-gray-700">Tên giảng viên</label>
            <input
              type="text"
              value={courseToEdit.instructor}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, instructor: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {/* Thêm khảo sát */}
            <div className="space-y-2 mt-2">
              <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-green-600" />
                Thêm khảo sát
              </h4>
              <label className="block text-sm font-medium text-gray-700">Link khảo sát trước khóa học</label>
              <input
                type="text"
                name="preSurvey"
                value={editSurvey.preSurvey}
                onChange={handleEditSurveyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Nhập link khảo sát trước khóa học"
              />
              <label className="block text-sm font-medium text-gray-700">Link khảo sát sau khóa học</label>
              <input
                type="text"
                name="postSurvey"
                value={editSurvey.postSurvey}
                onChange={handleEditSurveyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Nhập link khảo sát sau khóa học"
              />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                onClick={() => setCourseToEdit(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleEditCourse({ ...courseToEdit, ...editSurvey });
                  setEditSurvey({ preSurvey: "", postSurvey: "" });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <div className="text-3xl font-extrabold text-blue-600">{courses.length}</div>
          <div className="text-sm text-gray-600 mt-1">Tổng khóa học</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <div className="text-3xl font-extrabold text-green-600">
            {courses.filter(c => c.status === "Đang diễn ra").length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Đang diễn ra</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <div className="text-3xl font-extrabold text-orange-600">
            {courses.reduce((sum, course) => sum + course.students, 0)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Tổng học viên</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <div className="text-3xl font-extrabold text-purple-600">
            {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Đánh giá trung bình</div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <form
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-green-200 animate-fade-in"
            onSubmit={handleSubmit}
            style={{
              boxShadow: "0 8px 32px 0 rgba(34,197,94,0.15), 0 1.5px 8px 0 rgba(59,130,246,0.10)"
            }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-50 via-white to-blue-50 border-b border-gray-100 px-8 py-5 flex items-center justify-between rounded-t-3xl shadow-sm z-10">
              <h3 className="text-2xl font-bold text-green-700 flex items-center gap-2 tracking-tight">
                <Plus className="w-6 h-6 text-green-500" />
                Thêm khóa học mới
              </h3>
              <button
                type="button"
                onClick={handleCloseForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-8 space-y-8 bg-gradient-to-br from-white via-blue-50 to-green-50 rounded-b-3xl">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên khóa học <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newCourse.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors bg-white shadow-sm"
                      placeholder="Nhập tên khóa học..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại khóa học <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={newCourse.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors bg-white shadow-sm"
                    >
                      <option value="Giáo dục cơ bản">Giáo dục cơ bản</option>
                      <option value="Kỹ năng sống">Kỹ năng sống</option>
                      <option value="Chuyên đề">Chuyên đề</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả khóa học <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={newCourse.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors bg-white shadow-sm resize-none"
                      placeholder="Mô tả chi tiết về khóa học..."
                    />
                  </div>
                </div>
              </div>
              {/* Course Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Chi tiết khóa học
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={newCourse.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={newCourse.endDate}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={newCourse.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                    >
                      <option value="Sắp khai giảng">Sắp khai giảng</option>
                      <option value="Đang diễn ra">Đang diễn ra</option>
                      <option value="Đã kết thúc">Đã kết thúc</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tuổi tối thiểu
                      </label>
                      <input
                        type="number"
                        name="ageMin"
                        value={newCourse.ageMin}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tuổi tối đa
                      </label>
                      <input
                        type="number"
                        name="ageMax"
                        value={newCourse.ageMax}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sức chứa tối đa
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={newCourse.capacity}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá khóa học (VNĐ)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input
                        type="number"
                        name="price"
                        value={newCourse.price}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                        placeholder="0"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Để 0 nếu khóa học miễn phí</p>
                  </div>
                </div>
              </div>
              {/* Survey */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-green-600" />
                  Thêm khảo sát (trước & sau khóa học)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link khảo sát trước khóa học
                    </label>
                    <input
                      type="text"
                      name="preSurvey"
                      value={newCourse.preSurvey}
                      onChange={handleSurveyChange}
                      className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                      placeholder="Nhập link khảo sát trước khóa học"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link khảo sát sau khóa học
                    </label>
                    <input
                      type="text"
                      name="postSurvey"
                      value={newCourse.postSurvey}
                      onChange={handleSurveyChange}
                      className="w-full px-5 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
                      placeholder="Nhập link khảo sát sau khóa học"
                    />
                  </div>
                </div>
              </div>
              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-7 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-all font-semibold flex items-center space-x-2 shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  <span>Tạo khóa học</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  </div>
);
};

export default CourseManagement;