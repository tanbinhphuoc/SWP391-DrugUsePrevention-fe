const UserAppointments = () => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">📅 Lịch hẹn tư vấn</h2>
      <ul className="space-y-2">
        <li className="p-3 border rounded bg-white shadow-sm">
          📌 Ngày: 10/06/2025 – Chuyên viên: Nguyễn Văn A – <span className="text-green-600 font-semibold">Đã xác nhận</span>
        </li>
        <li className="p-3 border rounded bg-white shadow-sm">
          📌 Ngày: 15/06/2025 – Chuyên viên: Trần Thị B – <span className="text-yellow-600 font-semibold">Đang chờ</span>
        </li>
      </ul>
    </div>
  );
};

export default UserAppointments;
