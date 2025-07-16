// ConsultantAppointments.jsx
import React, { useState, useEffect } from 'react';

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
        return status; // Or "Xác nhận" if there's a confirmed status
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Lịch hẹn</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-100 rounded">
          <p className="text-3xl font-bold">{todaysConfirmed}</p>
          <p>Lịch hẹn hôm nay (xác nhận)</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <p className="text-3xl font-bold">{totalPending}</p>
          <p>Tổng chờ xác nhận</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <p className="text-3xl font-bold">{totalConfirmed}</p>
          <p>Tổng đã xác nhận</p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <p className="text-3xl font-bold">{totalCanceled}</p>
          <p>Tổng hủy</p>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Ngày</th>
            <th className="p-2">Thời gian</th>
            <th className="p-2">Khách hàng</th>
            <th className="p-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr key={apt.id} className="border-t">
              <td className="p-2">{apt.date}</td>
              <td className="p-2">{apt.time}</td>
              <td className="p-2">{apt.client}</td>
              <td className="p-2">{apt.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ConsultantAppointments;