import { useState } from "react";
import { Search, Edit2, Trash2, Plus, BookOpen, Users, Clock, Star, X, Calendar, DollarSign, Award, FileText, ClipboardList, ChevronRight, Sparkles, Target, TrendingUp } from "lucide-react";

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
    price: 0,
    preSurvey: "",
    postSurvey: ""
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
      price: 0,
      preSurvey: "",
      postSurvey: ""
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
    if (!newCourse.title || !newCourse.description || !newCourse.startDate || !newCourse.endDate) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
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
    alert("✅ Đã thêm khóa học mới!");
    handleCloseForm();
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      setCourses(prev => prev.filter(course => course.id !== id));
    }
  };

  const handleConfirmDelete = (id) => {
    setIsDeleting(true);
    setTimeout(() => {
      setCourses(prev => prev.filter(course => course.id !== id));
      setIsDeleting(false);
      setCourseToDelete(null);
      alert("✅ Đã xóa khóa học thành công!");
    }, 1000);
  };

  const handleEditCourse = (updatedCourse) => {
    setCourses(prev =>
      prev.map(course =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    setCourseToEdit(null);
    alert("✅ Đã cập nhật khóa học thành công!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header với hiệu ứng glassmorphism */}
      <div className="backdrop-blur-sm bg-white/30 border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Quản lý khóa học
                </h1>
                <p className="text-gray-600 mt-1">Tạo và quản lý các khóa học một cách hiệu quả</p>
              </div>
            </div>
            <button
              onClick={handleAddCourse}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-semibold">Tạo khóa học mới</span>
                <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter với design nâng cao */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học hoặc giảng viên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 min-w-[200px]"
                >
                  <option value="">Tất cả danh mục</option>
                  <option value="Giáo dục cơ bản">Giáo dục cơ bản</option>
                  <option value="Kỹ năng sống">Kỹ năng sống</option>
                  <option value="Chuyên đề">Chuyên đề</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-6 py-4 bg-white/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 min-w-[200px]"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Đang diễn ra">Đang diễn ra</option>
                  <option value="Sắp khai giảng">Sắp khai giảng</option>
                  <option value="Đã kết thúc">Đã kết thúc</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Course Statistics với hiệu ứng đẹp */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: BookOpen, label: "Tổng khóa học", value: courses.length, color: "from-blue-500 to-indigo-600", bg: "from-blue-50 to-indigo-50" },
            { icon: TrendingUp, label: "Đang diễn ra", value: courses.filter(c => c.status === "Đang diễn ra").length, color: "from-emerald-500 to-teal-600", bg: "from-emerald-50 to-teal-50" },
            { icon: Users, label: "Tổng học viên", value: courses.reduce((sum, course) => sum + course.students, 0), color: "from-orange-500 to-red-500", bg: "from-orange-50 to-red-50" },
            { icon: Star, label: "Đánh giá TB", value: (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1), color: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50" }
          ].map((stat, index) => (
            <div key={index} className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl"></div>
              <div className={`bg-gradient-to-br ${stat.bg} p-6 rounded-3xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses Grid với design card đẹp hơn */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{course.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full border border-blue-200">
                          {course.category}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full border border-purple-200">
                          {course.level}
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full border border-gray-200">
                          {course.duration}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="p-1 bg-gray-100 rounded-lg mr-3">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{course.students} học viên</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="p-1 bg-yellow-100 rounded-lg mr-3">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="font-medium">{course.rating}/5.0</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="p-1 bg-gray-100 rounded-lg mr-3">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span>Cập nhật: {course.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                      <span className="font-medium">Giảng viên:</span> {course.instructor}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 ${
                      course.status === "Đang diễn ra"
                        ? "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200"
                        : course.status === "Sắp khai giảng"
                        ? "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-200"
                    }`}>
                      {course.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110"
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
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Delete Modal */}
        {courseToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-100">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa khóa học</h3>
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn xóa <span className="font-semibold text-gray-900">"{courseToDelete.title}"</span>? 
                  Hành động này không thể hoàn tác.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setCourseToDelete(null)}
                  className="flex-1 px-6 py-3 text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => handleConfirmDelete(courseToDelete.id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Edit Modal */}
        {courseToEdit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
              <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 px-8 py-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                      <Edit2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Chỉnh sửa khóa học
                    </h3>
                  </div>
                  <button
                    onClick={() => setCourseToEdit(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Tên khóa học</label>
                  <input
                    type="text"
                    value={courseToEdit.title}
                    onChange={(e) => setCourseToEdit({ ...courseToEdit, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Tên giảng viên</label>
                  <input
                    type="text"
                    value={courseToEdit.instructor}
                    onChange={(e) => setCourseToEdit({ ...courseToEdit, instructor: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                      <ClipboardList className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">Khảo sát khóa học</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link khảo sát trước khóa học</label>
                      <input
                        type="text"
                        name="preSurvey"
                        value={editSurvey.preSurvey}
                        onChange={handleEditSurveyChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link khảo sát sau khóa học</label>
                      <input
                        type="text"
                        name="postSurvey"
                        value={editSurvey.postSurvey}
                        onChange={handleEditSurveyChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setCourseToEdit(null)}
                    className="flex-1 px-6 py-3 text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => {
                      handleEditCourse({ ...courseToEdit, ...editSurvey });
                      setEditSurvey({ preSurvey: "", postSurvey: "" });
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                  >
                    Lưu thay đổi
                  </button>
                </div>
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

      {/* Enhanced Add Course Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <form
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto border border-emerald-200 transform transition-all duration-500 ease-out scale-100 opacity-100"
            onSubmit={handleSubmit}
            style={{
              boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.05)"
            }}
          >
            {/* Enhanced Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-6 flex items-center justify-between rounded-t-3xl shadow-lg z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-sm"></div>
                  <div className="relative p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                    <Plus className="w-7 h-7 text-white drop-shadow-sm" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white drop-shadow-sm tracking-tight">
                    Tạo khóa học mới
                  </h3>
                  <p className="text-emerald-100 mt-1 font-medium">Chia sẻ kiến thức và truyền cảm hứng</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseForm}
                className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 group backdrop-blur-sm border border-white/20"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            {/* Enhanced Modal Body */}
            <div className="p-8 space-y-10 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-75"></div>
                    <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Thông tin cơ bản
                    </h4>
                    <p className="text-gray-500 mt-1">Thiết lập thông tin chính cho khóa học</p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-blue-200 via-purple-200 to-transparent ml-4"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span>Tên khóa học</span>
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newCourse.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                      placeholder="Nhập tên khóa học hấp dẫn..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span>Loại khóa học</span>
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <select
                      name="type"
                      value={newCourse.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800"
                    >
                      <option value="Giáo dục cơ bản">🎓 Giáo dục cơ bản</option>
                      <option value="Kỹ năng sống">🌟 Kỹ năng sống</option>
                      <option value="Chuyên đề">🎯 Chuyên đề</option>
                    </select>
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span>Mô tả khóa học</span>
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={newCourse.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none text-gray-800 placeholder-gray-400"
                      placeholder="Mô tả chi tiết về nội dung, mục tiêu và lợi ích của khóa học..."
                    />
                  </div>
                </div>
              </div>

              {/* Course Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur opacity-75"></div>
                    <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Chi tiết khóa học
                    </h4>
                    <p className="text-gray-500 mt-1">Cấu hình thời gian và điều kiện tham gia</p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-green-200 via-emerald-200 to-transparent ml-4"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>Ngày bắt đầu</span>
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={newCourse.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>Ngày kết thúc</span>
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={newCourse.endDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span>Trạng thái</span>
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <select
                      name="status"
                      value={newCourse.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800"
                    >
                      <option value="Sắp khai giảng">🚀 Sắp khai giảng</option>
                      <option value="Đang diễn ra">▶️ Đang diễn ra</option>
                      <option value="Đã kết thúc">✅ Đã kết thúc</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span>Giá khóa học (VNĐ)</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newCourse.price}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                      placeholder="Nhập 0 nếu miễn phí"
                    />
                    <p className="text-xs text-emerald-600 font-medium">💡 Để 0 nếu khóa học miễn phí</p>
                  </div>

                  {/* Age Range */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">
                      Độ tuổi tham gia
                    </label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          name="ageMin"
                          value={newCourse.ageMin}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                          placeholder="Từ"
                        />
                      </div>
                      <div className="flex items-center px-2">
                        <span className="text-gray-400 font-medium">đến</span>
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          name="ageMax"
                          value={newCourse.ageMax}
                          onChange={handleInputChange}
                          min="0"
                          max="100"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                          placeholder="Tới"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>Sức chứa tối đa</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={newCourse.capacity}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                      placeholder="Số lượng học viên tối đa"
                    />
                  </div>
                </div>
              </div>

              {/* Survey Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl blur opacity-75"></div>
                    <div className="relative p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
                      <ClipboardList className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Khảo sát & Đánh giá
                    </h4>
                    <p className="text-gray-500 mt-1">Thu thập phản hồi trước và sau khóa học</p>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 via-red-200 to-transparent ml-4"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span>📝 Link khảo sát trước khóa học</span>
                    </label>
                    <input
                      type="url"
                      name="preSurvey"
                      value={newCourse.preSurvey}
                      onChange={handleSurveyChange}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                      placeholder="https://forms.google.com/..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span>📊 Link khảo sát sau khóa học</span>
                    </label>
                    <input
                      type="url"
                      name="postSurvey"
                      value={newCourse.postSurvey}
                      onChange={handleSurveyChange}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
                      placeholder="https://forms.google.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Form Actions */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t-2 border-gray-100 px-8 py-6 rounded-b-3xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-red-500 text-lg">*</span>
                  <span className="font-medium">Các trường bắt buộc phải điền</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200 font-bold"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 hover:scale-105 hover:shadow-xl transition-all duration-200 font-bold flex items-center gap-3 shadow-lg"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Tạo khóa học</span>
                  </button>
                </div>
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