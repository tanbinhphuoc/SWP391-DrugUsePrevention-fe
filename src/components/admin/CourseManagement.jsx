import { useState } from "react";
import { Search, Edit2, Trash2, Plus, BookOpen } from "lucide-react";

const CourseManagement = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Nhận thức về ma túy cho học sinh",
      category: "Giáo dục",
      level: "Cơ bản",
      duration: "4 tuần",
      status: "Đang diễn ra",
    },
    {
      id: 2,
      title: "Kỹ năng từ chối ma túy",
      category: "Kỹ năng sống",
      level: "Trung cấp",
      duration: "6 tuần",
      status: "Sắp khai giảng",
    },
    {
      id: 3,
      title: "Phòng chống ma túy trong trường học",
      category: "Chuyên đề",
      level: "Nâng cao",
      duration: "8 tuần",
      status: "Đã kết thúc",
    },
  ]);

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
      <div className="mb-6 flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Tất cả danh mục</option>
          <option value="education">Giáo dục</option>
          <option value="skills">Kỹ năng sống</option>
          <option value="special">Chuyên đề</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang diễn ra</option>
          <option value="upcoming">Sắp khai giảng</option>
          <option value="completed">Đã kết thúc</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
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
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex items-center justify-between mt-4">
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
    </div>
  );
};

export default CourseManagement;