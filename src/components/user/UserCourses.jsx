// THAY ĐỔI: Thêm useState và dữ liệu động
import { useState } from "react";

const UserCourses = () => {
  // THAY ĐỔI: Thêm state cho tìm kiếm và danh sách khóa học
  const [search, setSearch] = useState("");
  const courses = [
    { name: "Nhận thức về ma túy", progress: "Hoàn thành 70%" },
    { name: "Kỹ năng từ chối", progress: "Chưa bắt đầu" },
  ];

  // THAY ĐỔI: Lọc khóa học theo tìm kiếm
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">📘 Khóa học của bạn</h2>
      {/* THAY ĐỔI: Thêm input tìm kiếm */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm khóa học..."
        className="w-full p-2 mb-4 border rounded"
      />
      <ul className="space-y-2">
        {filteredCourses.map((course, index) => (
          <li key={index} className="flex justify-between">
            <span>{course.name}</span>
            <span className="text-blue-600 font-medium">
              {course.progress === "Chưa bắt đầu" ? (
                <a href="#" className="text-blue-500 hover:underline">
                  Bắt đầu
                </a>
              ) : (
                course.progress
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UserCourses;