const UserOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-blue-100 p-4 rounded shadow">📘 Khóa học đã tham gia: <strong>3</strong></div>
      <div className="bg-green-100 p-4 rounded shadow">📅 Lịch hẹn sắp tới: <strong>2</strong></div>
      <div className="bg-yellow-100 p-4 rounded shadow">🧠 Nguy cơ ma túy: <strong>Thấp</strong></div>
      <div className="bg-purple-100 p-4 rounded shadow">📣 Chương trình cộng đồng: <strong>5</strong></div>
    </div>
  );
};

export default UserOverview;