import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, Users, Bell, Calendar, BarChart2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chart from "chart.js/auto";

const StaffOverview = () => {
  const [stats, setStats] = useState({
    memberCount: 0,
    activeInactiveRatio: { active: 0, inactive: 0 },
    totalAssessments: 0,
    appointments: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debug token
      if (!token) throw new Error("Vui lòng đăng nhập.");

      // Fetch member stats
      const statsResponse = await fetch("http://localhost:7092/api/Admin/users/GetAllUserStats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Stats Response Status:", statsResponse.status); // Debug status
      if (!statsResponse.ok) {
        const errorText = await statsResponse.text();
        throw new Error(`Không thể lấy thống kê thành viên. Mã lỗi: ${statsResponse.status} - ${errorText}`);
      }
      const statsData = await statsResponse.json();
      console.log("Stats Data:", statsData); // Debug data
      if (!statsData.success || !statsData.data) throw new Error("Dữ liệu API không hợp lệ.");
      const roleCounts = Array.isArray(statsData.data.roleCounts) ? statsData.data.roleCounts : [];
      const activeInactiveRatio = statsData.data.activeInactiveRatio || { Active: 0, Inactive: 0 };
      setStats(prev => ({
        ...prev,
        memberCount: roleCounts.reduce((a, b) => a + b, 0),
        activeInactiveRatio: { active: activeInactiveRatio.Active || 0, inactive: activeInactiveRatio.Inactive || 0 },
      }));

      // Fetch total assessments
      const assessResponse = await fetch("http://localhost:7092/api/AssessmentStatistics/total", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!assessResponse.ok) {
        const errorText = await assessResponse.text();
        throw new Error(`Không thể lấy tổng số bài đánh giá. Mã lỗi: ${assessResponse.status} - ${errorText}`);
      }
      const assessData = await assessResponse.json();
      setStats(prev => ({ ...prev, totalAssessments: assessData.totalAssessments || 0 }));

      // Fetch all members
      const usersResponse = await fetch("http://localhost:7092/api/Admin/GetAllMember", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!usersResponse.ok) {
        const errorText = await usersResponse.text();
        throw new Error(`Không thể lấy danh sách thành viên. Mã lỗi: ${usersResponse.status} - ${errorText}`);
      }
      const usersData = await usersResponse.json();
      if (!usersData.success || !Array.isArray(usersData.data)) throw new Error("Dữ liệu thành viên không hợp lệ.");
      setUsers(usersData.data.map(user => ({
        id: user.userID,
        userName: user.userName || "Chưa cập nhật",
        fullName: user.fullName || "Chưa cập nhật",
        status: user.status || "Inactive",
        createdAt: new Date(user.createdAt).toLocaleString("vi-VN"),
      })));

      // Fetch all appointments
      const apptResponse = await fetch("http://localhost:7092/api/Admin/GetAllAppointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!apptResponse.ok) {
        const errorText = await apptResponse.text();
        throw new Error(`Không thể lấy danh sách lịch hẹn. Mã lỗi: ${apptResponse.status} - ${errorText}`);
      }
      const apptData = await apptResponse.json();
      setStats(prev => ({ ...prev, appointments: apptData.data || [] }));
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateChart = () => {
    if (chartInstance.current) chartInstance.current.destroy();
    const ctx = chartRef.current?.getContext("2d");
    if (ctx && typeof Chart !== "undefined") {
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Active", "Inactive"],
          datasets: [{
            data: [stats.activeInactiveRatio.active, stats.activeInactiveRatio.inactive],
            backgroundColor: ["#10B981", "#EF4444"],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Tỷ lệ Thành viên Active/Inactive" },
          },
        },
      });
    } else {
      console.error("Chart.js không được tải hoặc canvas không tồn tại.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateChart();
  }, [stats.activeInactiveRatio]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Trang Tổng quan - Staff</h1>
          <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
          >
            <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
            <span className="text-lg">Làm mới</span>
          </button>
        </header>

        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between shadow-md">
              <span className="text-red-700 text-lg">{error}</span>
              <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300 transition-all"
              >
                Thử lại
              </button>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" /> Thành viên
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.memberCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-purple-600" /> Bài đánh giá
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalAssessments}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" /> Lịch hẹn
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.appointments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Tỷ lệ Active/Inactive</h3>
            <p className="text-lg font-medium mt-2">
              Active: {stats.activeInactiveRatio.active}%, Inactive: {stats.activeInactiveRatio.inactive}%
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Danh sách thành viên
          </h2>
          {loading ? (
              <div className="flex justify-center items-center py-6">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-600" />
              </div>
          ) : users.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-lg">Không có thành viên nào.</div>
          ) : (
              <table className="w-full border-collapse">
                <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-6 py-3 text-left border-b-2 border-gray-200">ID</th>
                  <th className="px-6 py-3 text-left border-b-2 border-gray-200">Tên đăng nhập</th>
                  <th className="px-6 py-3 text-left border-b-2 border-gray-200">Họ tên</th>
                  <th className="px-6 py-3 text-left border-b-2 border-gray-200">Trạng thái</th>
                  <th className="px-6 py-3 text-left border-b-2 border-gray-200">Ngày tạo</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4 border-b">{user.id}</td>
                      <td className="px-6 py-4 border-b">{user.userName}</td>
                      <td className="px-6 py-4 border-b">{user.fullName}</td>
                      <td className="px-6 py-4 border-b">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            user.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {user.status === "Active" ? "Đang hoạt động" : "Không hoạt động"}
                                        </span>
                      </td>
                      <td className="px-6 py-4 border-b">{user.createdAt}</td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-yellow-600" /> Thông báo
            </h2>
            <p className="text-gray-500 text-lg">Chưa có thông báo mới.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" /> Lịch hẹn gần đây
            </h2>
            {stats.appointments.length > 0 ? (
                <ul className="space-y-3">
                  {stats.appointments.slice(0, 3).map((appt) => (
                      <li key={appt.appointmentID} className="p-3 bg-gray-50 rounded-lg shadow">
                        <p className="text-gray-700">{appt.consultantName} - {new Date(appt.startDateTime).toLocaleString("vi-VN")}</p>
                        <span className={`text-sm font-medium ${
                            appt.status === "CONFIRMED" ? "text-green-600" : "text-red-600"
                        }`}>
                                        {appt.status}
                                    </span>
                      </li>
                  ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-lg">Không có lịch hẹn nào.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <canvas ref={chartRef} className="w-full h-72"></canvas>
        </div>
      </div>
  );
};

export default StaffOverview;