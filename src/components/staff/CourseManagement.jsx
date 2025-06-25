import { useState } from "react";
import { Search, Edit2, Trash2, Plus, BookOpen, Users, Clock, Star } from "lucide-react";

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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "" || course.category === filterCategory;
    const matchesStatus = filterStatus === "" || course.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý khóa học</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả danh mục</option>
          <option value="Giáo dục cơ bản">Giáo dục cơ bản</option>
          <option value="Kỹ năng sống">Kỹ năng sống</option>
          <option value="Chuyên đề">Chuyên đề</option>
        </select>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Đang diễn ra">Đang diễn ra</option>
          <option value="Sắp khai giảng">Sắp khai giảng</option>
          <option value="Đã kết thúc">Đã kết thúc</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {course.level}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {course.duration}
                    </span>
                  </div>
                </div>
                <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0" />
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
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  course.status === "Đang diễn ra"
                    ? "bg-green-100 text-green-800"
                    : course.status === "Sắp khai giảng"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {course.status}
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
          <div className="text-sm text-gray-600">Tổng khóa học</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {courses.filter(c => c.status === "Đang diễn ra").length}
          </div>
          <div className="text-sm text-gray-600">Đang diễn ra</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {courses.reduce((sum, course) => sum + course.students, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng học viên</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">
            {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Đánh giá trung bình</div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;