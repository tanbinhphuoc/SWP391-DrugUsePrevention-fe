// ConsultantAppointments.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, XCircle, Loader } from 'lucide-react';

const ConsultantAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [todaysConfirmed, setTodaysConfirmed] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalCanceled, setTotalCanceled] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Vui lòng đăng nhập để tiếp tục.");
        }

        const response = await fetch("http://localhost:7092/api/Appointments/GetAllAppointmentAboutConsultant", {
          method: "GET",
          headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Lấy danh sách lịch hẹn thất bại: ${errorText}`);
        }

        const data = await response.json();
        if (!data.success || !Array.isArray(data.data)) {
          throw new Error("Dữ liệu không hợp lệ.");
        }

        // Sort by startDateTime ascending
        const sortedData = data.data.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));

        const mappedAppointments = sortedData.map((apt) => ({
          id: apt.appointmentID,
          date: new Date(apt.startDateTime).toLocaleDateString('vi-VN'),
          time: new Date(apt.startDateTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          client: apt.memberName,
          status: mapStatus(apt.status),
        }));

        setAppointments(mappedAppointments);

        // Calculate today's confirmed and totals
        const today = new Date().toLocaleDateString('vi-VN');
        let confirmedTodayCount = 0;
        let pendingCount = 0;
        let confirmedCount = 0;
        let canceledCount = 0;

        sortedData.forEach(apt => {
          const aptDate = new Date(apt.startDateTime).toLocaleDateString('vi-VN');
          const statusMapped = mapStatus(apt.status);

          if (statusMapped === "Chờ xác nhận") pendingCount++;
          if (statusMapped === "Đã xác nhận") {
            confirmedCount++;
            if (aptDate === today) confirmedTodayCount++;
          }
          if (statusMapped === "Hủy") canceledCount++;
        });

        setTodaysConfirmed(confirmedTodayCount);
        setTotalPending(pendingCount);
        setTotalConfirmed(confirmedCount);
        setTotalCanceled(canceledCount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const mapStatus = (status) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "Chờ xác nhận";
      case "CANCELED":
        return "Hủy";
      case "CONFIRMED":
        return "Đã xác nhận";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-8 rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Lịch hẹn</h2>
          <p className="text-gray-600 text-sm">Quản lý cuộc hẹn của bạn</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Today's Confirmed */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-blue-600 text-xs font-semibold uppercase tracking-wide">Hôm nay</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-blue-800">{todaysConfirmed}</p>
            <p className="text-blue-700 text-sm font-medium">Lịch hẹn hôm nay (xác nhận)</p>
          </div>
        </div>

        {/* Total Pending */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-yellow-600 text-xs font-semibold uppercase tracking-wide">Chờ</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-yellow-800">{totalPending}</p>
            <p className="text-yellow-700 text-sm font-medium">Tổng chờ xác nhận</p>
          </div>
        </div>

        {/* Total Confirmed */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-600 text-xs font-semibold uppercase tracking-wide">Hoàn thành</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-green-800">{totalConfirmed}</p>
            <p className="text-green-700 text-sm font-medium">Tổng đã xác nhận</p>
          </div>
        </div>

        {/* Total Canceled */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-red-600 text-xs font-semibold uppercase tracking-wide">Hủy bỏ</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-red-800">{totalCanceled}</p>
            <p className="text-red-700 text-sm font-medium">Tổng hủy</p>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Danh sách lịch hẹn</h3>
          <p className="text-gray-600 text-sm mt-1">Tổng cộng {appointments.length} cuộc hẹn</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Ngày</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Thời gian</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Khách hàng</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <Calendar className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">Chưa có lịch hẹn nào</p>
                      <p className="text-gray-400 text-sm">Các cuộc hẹn sẽ xuất hiện tại đây</p>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((apt, index) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{apt.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{apt.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{apt.client}</p>
                          <p className="text-xs text-gray-500">Khách hàng #{index + 1}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'Đã xác nhận' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : apt.status === 'Chờ xác nhận' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {apt.status === 'Đã xác nhận' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {apt.status === 'Chờ xác nhận' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {apt.status === 'Hủy' && <XCircle className="w-3 h-3 mr-1" />}
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ConsultantAppointments;