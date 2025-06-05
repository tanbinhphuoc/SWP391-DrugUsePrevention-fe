const UserCourses = () => {
  return (
    <section className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">📘 Khóa học của bạn</h2>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>Nhận thức về ma túy</span>
          <span className="text-blue-600 font-medium">Hoàn thành 70%</span>
        </li>
        <li className="flex justify-between">
          <span>Kỹ năng từ chối</span>
          <a href="#" className="text-blue-500 hover:underline">Bắt đầu</a>
        </li>
      </ul>
    </section>
  );
};

export default UserCourses;
