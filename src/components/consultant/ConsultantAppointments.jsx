import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle, XCircle, Loader, AlertCircle, User, BookOpen, BarChart2, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConsultantAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [todaysConfirmed, setTodaysConfirmed] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalConfirmed, setTotalConfirmed] = useState(0);
  const [totalCanceled, setTotalCanceled] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in.");

        const response = await fetch("http://localhost:7092/api/Appointments/GetAllAppointmentAboutConsultant", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        if (!data.success || !Array.isArray(data.data)) throw new Error("Invalid data format.");

        const sortedData = data.data.sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime)); // Sắp xếp giảm dần
        const mappedAppointments = sortedData.map((apt) => ({
          id: apt.appointmentID,
          userId: apt.userID,
          date: new Date(apt.startDateTime).toLocaleDateString("vi-VN"),
          timeRange: `${new Date(apt.startDateTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(apt.endDateTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`, // Thêm khoảng thời gian
          client: apt.memberName,
          status: mapStatus(apt.status),
          rawStatus: apt.status || "UNKNOWN",
          startDateTime: new Date(apt.startDateTime),
        }));

        setAppointments(mappedAppointments);

        const today = new Date().toLocaleDateString("vi-VN");
        let confirmedTodayCount = 0;
        let pendingCount = 0;
        let confirmedCount = 0;
        let canceledCount = 0;

        sortedData.forEach((apt) => {
          const aptDate = new Date(apt.startDateTime).toLocaleDateString("vi-VN");
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
        toast.error(`Lỗi tải lịch hẹn: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch member profile
  const fetchMemberProfile = async (userId) => {
    setProfileLoading(true);
    setSelectedMember(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      const response = await fetch(`http://localhost:7092/api/Users/GetMemberProfileWithFullOption?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const profileData = data.success !== undefined && data.data ? data.data : data;
      if (!profileData || typeof profileData !== "object") throw new Error("Invalid profile data.");

      setSelectedMember(profileData);
    } catch (err) {
      setError(err.message);
      toast.error(`Lỗi tải hồ sơ: ${err.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  // Map status to readable format
  const mapStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
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

  // Get status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "Đã xác nhận":
        return "bg-green-100 text-green-700 ring-green-600/20";
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-700 ring-yellow-600/20";
      case "Hủy":
        return "bg-red-100 text-red-700 ring-red-600/20";
      default:
        return "bg-gray-100 text-gray-700 ring-gray-500/10";
    }
  };

  // Modal close
  const closeModal = () => {
    setSelectedMember(null);
  };

  // Handle status update (Confirm or Cancel)
  const handleUpdateStatus = async (appointmentId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in.");

      let response;
      if (action === "confirm") {
        response = await fetch(`http://localhost:7092/api/Appointments/${appointmentId}/ConfirmFreeAppointment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (action === "cancel") {
        response = await fetch(`http://localhost:7092/api/Appointments/${appointmentId}/CancelAppointment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        throw new Error("Hành động không hợp lệ.");
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Cập nhật thất bại. Mã: ${response.status}`);

      // Refresh appointments
      const fetchResponse = await fetch("http://localhost:7092/api/Appointments/GetAllAppointmentAboutConsultant", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const fetchData = await fetchResponse.json();
      if (!fetchResponse.ok || !fetchData.success || !Array.isArray(fetchData.data)) throw new Error("Lỗi làm mới danh sách.");

      const sortedData = fetchData.data.sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime));
      const mappedAppointments = sortedData.map((apt) => ({
        id: apt.appointmentID,
        userId: apt.userID,
        date: new Date(apt.startDateTime).toLocaleDateString("vi-VN"),
        timeRange: `${new Date(apt.startDateTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(apt.endDateTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
        client: apt.memberName,
        status: mapStatus(apt.status),
        rawStatus: apt.status || "UNKNOWN",
        startDateTime: new Date(apt.startDateTime),
      }));

      setAppointments(mappedAppointments);

      const today = new Date().toLocaleDateString("vi-VN");
      let confirmedTodayCount = 0;
      let pendingCount = 0;
      let confirmedCount = 0;
      let canceledCount = 0;

      sortedData.forEach((apt) => {
        const aptDate = new Date(apt.startDateTime).toLocaleDateString("vi-VN");
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

      toast.success(`Cập nhật trạng thái thành ${action === "confirm" ? "Đã xác nhận" : "Đã hủy"} thành công!`);
    } catch (err) {
      setError(err.message);
      toast.error(`Lỗi cập nhật trạng thái: ${err.message}`);
    }
  };

  // If loading, show a loading spinner
  if (loading) {
    return (
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader className="w-16 h-16 animate-spin text-blue-500" />
            <p className="text-gray-600 text-lg font-medium">Đang tải dữ liệu lịch hẹn...</p>
          </div>
        </section>
    );
  }

  // If error, show error message
  if (error) {
    return (
        <section className="bg-white p-6 rounded-xl shadow-lg border border-red-300 min-h-[400px] flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-lg text-center shadow-md">
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="w-14 h-14 text-red-500" />
              <p className="text-red-700 font-semibold text-xl">Đã xảy ra lỗi!</p>
              <p className="text-red-600 text-base">{error}</p>
              <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
              >
                Thử lại
              </button>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center space-x-5 mb-8 border-b pb-6 border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Tổng quan lịch hẹn</h1>
            <p className="text-gray-600 text-lg mt-1">Quản lý và theo dõi các cuộc hẹn của bạn một cách hiệu quả.</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-7 h-7 text-blue-600" />
              <span className="text-blue-600 text-sm font-semibold px-3 py-1 bg-blue-100 rounded-full">Hôm nay</span>
            </div>
            <p className="text-3xl font-bold text-blue-800">{todaysConfirmed}</p>
            <p className="text-blue-700 text-base mt-1">Lịch hẹn đã xác nhận hôm nay</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-yellow-200 shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="w-7 h-7 text-yellow-600" />
              <span className="text-yellow-600 text-sm font-semibold px-3 py-1 bg-yellow-100 rounded-full">Chờ</span>
            </div>
            <p className="text-3xl font-bold text-yellow-800">{totalPending}</p>
            <p className="text-yellow-700 text-base mt-1">Tổng số lịch hẹn chờ xác nhận</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-green-200 shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-7 h-7 text-green-600" />
              <span className="text-green-600 text-sm font-semibold px-3 py-1 bg-green-100 rounded-full">Hoàn thành</span>
            </div>
            <p className="text-3xl font-bold text-green-800">{totalConfirmed}</p>
            <p className="text-green-700 text-base mt-1">Tổng số lịch hẹn đã xác nhận</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-red-200 shadow-md transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-3">
              <XCircle className="w-7 h-7 text-red-600" />
              <span className="text-red-600 text-sm font-semibold px-3 py-1 bg-red-100 rounded-full">Hủy bỏ</span>
            </div>
            <p className="text-3xl font-bold text-red-800">{totalCanceled}</p>
            <p className="text-red-700 text-base mt-1">Tổng số lịch hẹn đã hủy</p>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Danh sách lịch hẹn chi tiết</h3>
              <p className="text-gray-600 text-sm mt-1">Tổng cộng {appointments.length} cuộc hẹn</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thời gian</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Khách hàng</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-4">
                        <Calendar className="w-16 h-16 text-gray-300" />
                        <p className="text-lg font-medium">Bạn chưa có lịch hẹn nào.</p>
                        <p className="text-sm text-gray-500">Hãy chờ đợi các yêu cầu tư vấn mới.</p>
                      </div>
                    </td>
                  </tr>
              ) : (
                  appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{apt.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{apt.timeRange}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{apt.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusBadge(apt.status)}`}
                    >
                      {apt.status}
                    </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                              onClick={() => fetchMemberProfile(apt.userId)}
                              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 mr-2"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Xem hồ sơ
                          </button>
                          <button
                              onClick={() => handleUpdateStatus(apt.id, "confirm")}
                              disabled={apt.rawStatus === "CONFIRMED" || apt.rawStatus === "CANCELED"}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:scale-105 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Xác nhận
                          </button>
                          <button
                              onClick={() => handleUpdateStatus(apt.id, "cancel")}
                              disabled={apt.rawStatus === "CANCELED"}
                              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Hủy
                          </button>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Member Profile */}
        {selectedMember && !profileLoading && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
              <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl transform scale-95 animate-scale-in">
                <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-xl shadow-md">
                  <h3 className="text-2xl font-bold flex items-center">
                    <User className="w-6 h-6 mr-3" />
                    Hồ sơ thành viên: {selectedMember.fullName || "Chưa xác định"}
                  </h3>
                  <button onClick={closeModal} className="text-gray-200 hover:text-white transition duration-200">
                    <XCircle className="w-8 h-8" />
                  </button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(90vh - 120px)" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                    <p><strong className="font-semibold text-gray-700 flex items-center"><User className="w-5 h-5 mr-2 text-blue-500" /> Họ tên:</strong> {selectedMember.fullName || <span className="text-gray-500 italic">Chưa cập nhật</span>}</p>
                    <p><strong className="font-semibold text-gray-700 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-500" /> Tuổi:</strong> {selectedMember.age || <span className="text-gray-500 italic">Chưa cập nhật</span>}</p>
                    <p><strong className="font-semibold text-gray-700 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-blue-500" /> Email:</strong> {selectedMember.email || <span className="text-gray-500 italic">Chưa cập nhật</span>}</p>
                    <p><strong className="font-semibold text-gray-700 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-blue-500" /> Số điện thoại:</strong> {selectedMember.phone || <span className="text-gray-500 italic">Chưa cập nhật</span>}</p>
                    <p className="col-span-1 md:col-span-2"><strong className="font-semibold text-gray-700 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-blue-500" /> Địa chỉ:</strong> {selectedMember.address || <span className="text-gray-500 italic">Chưa cập nhật</span>}</p>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-indigo-600" /> Khóa học đã đăng ký</h4>
                    {selectedMember.registeredCourses && selectedMember.registeredCourses.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 text-base space-y-1 ml-4">
                          {selectedMember.registeredCourses.map((course, index) => (
                              <li key={index}>{course}</li>
                          ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">Không có khóa học nào được đăng ký.</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-green-600" /> Kết quả khảo sát</h4>
                    {selectedMember.assessmentResults && selectedMember.assessmentResults.length > 0 ? (
                        <ul className="space-y-3">
                          {selectedMember.assessmentResults.map((result, index) => (
                              <li key={index} className="flex items-center text-gray-700 text-base">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                <span className="font-medium">{result.stage}</span> - Điểm: <span className="font-semibold text-green-700 ml-1">{result.score}</span> (Thời gian: {new Date(result.takeTime).toLocaleString("vi-VN")})
                              </li>
                          ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">Không có kết quả khảo sát nào.</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-purple-600" /> Tư vấn viên trước đây</h4>
                    {selectedMember.previousConsultants && selectedMember.previousConsultants.length > 0 ? (
                        <ul className="space-y-3">
                          {selectedMember.previousConsultants.map((consultant, index) => (
                              <li key={index} className="flex items-center text-gray-700 text-base">
                                <User className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                                <span className="font-medium">{consultant.consultantName}</span> (<span className="text-gray-600 italic">{consultant.consultantEmail}</span>)
                              </li>
                          ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">Không có tư vấn viên nào trước đây.</p>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end rounded-b-xl">
                  <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out shadow-md"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Loading overlay for profile */}
        {profileLoading && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
              <div className="flex flex-col items-center space-y-4">
                <Loader className="w-16 h-16 animate-spin text-blue-400" />
                <p className="text-white font-semibold text-lg">Đang tải hồ sơ thành viên...</p>
              </div>
            </div>
        )}
      </section>
  );
};

export default ConsultantAppointments;