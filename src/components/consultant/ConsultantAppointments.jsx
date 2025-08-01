import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle, XCircle, Loader, AlertCircle, User, BookOpen, BarChart2, MessageSquare } from "lucide-react";

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
  const [updateLoading, setUpdateLoading] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'info') => {
    // Simple toast implementation without external dependency
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
      type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 5000);
  };

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check for token in state management or localStorage
        const token = localStorage?.getItem("token") || sessionStorage?.getItem("token");
        if (!token) {
          throw new Error("Vui lòng đăng nhập để tiếp tục.");
        }

        const response = await fetch("http://localhost:7092/api/Appointments/GetAllAppointmentAboutConsultant", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể tải lịch hẹn: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        // Handle different response structures
        let appointmentsData = [];
        if (data.success && Array.isArray(data.data)) {
          appointmentsData = data.data;
        } else if (Array.isArray(data)) {
          appointmentsData = data;
        } else {
          throw new Error("Định dạng dữ liệu không hợp lệ từ server.");
        }

        // Sort by date descending
        const sortedData = appointmentsData.sort((a, b) => {
          const dateA = new Date(a.startDateTime || a.startDate);
          const dateB = new Date(b.startDateTime || b.startDate);
          return dateB - dateA;
        });

        // Map appointments with error handling
        const mappedAppointments = sortedData.map((apt) => {
          const startDate = new Date(apt.startDateTime || apt.startDate);
          const endDate = new Date(apt.endDateTime || apt.endDate);
          
          // Validate dates
          if (isNaN(startDate.getTime())) {
            console.warn('Invalid start date for appointment:', apt);
          }
          if (isNaN(endDate.getTime())) {
            console.warn('Invalid end date for appointment:', apt);
          }

          return {
            id: apt.appointmentID || apt.id,
            userId: apt.userID || apt.userId,
            date: isNaN(startDate.getTime()) ? "Ngày không hợp lệ" : startDate.toLocaleDateString("vi-VN"),
            timeRange: isNaN(startDate.getTime()) || isNaN(endDate.getTime()) 
              ? "Thời gian không hợp lệ"
              : `${startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
            client: apt.memberName || apt.clientName || "Chưa xác định",
            status: mapStatus(apt.status),
            rawStatus: apt.status || "UNKNOWN",
            startDateTime: startDate,
          };
        });

        setAppointments(mappedAppointments);

        // Calculate statistics
        const today = new Date().toLocaleDateString("vi-VN");
        let confirmedTodayCount = 0;
        let pendingCount = 0;
        let confirmedCount = 0;
        let canceledCount = 0;

        sortedData.forEach((apt) => {
          const aptDate = new Date(apt.startDateTime || apt.startDate);
          const aptDateString = isNaN(aptDate.getTime()) ? "" : aptDate.toLocaleDateString("vi-VN");
          const statusMapped = mapStatus(apt.status);

          if (statusMapped === "Chờ xác nhận") pendingCount++;
          if (statusMapped === "Đã xác nhận") {
            confirmedCount++;
            if (aptDateString === today) confirmedTodayCount++;
          }
          if (statusMapped === "Hủy") canceledCount++;
        });

        setTodaysConfirmed(confirmedTodayCount);
        setTotalPending(pendingCount);
        setTotalConfirmed(confirmedCount);
        setTotalCanceled(canceledCount);

      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
        showToast(`Lỗi tải lịch hẹn: ${err.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch member profile with improved error handling
  const fetchMemberProfile = async (userId) => {
    if (!userId) {
      showToast("ID người dùng không hợp lệ", 'error');
      return;
    }

    setProfileLoading(true);
    setSelectedMember(null);
    
    try {
      const token = localStorage?.getItem("token") || sessionStorage?.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để tiếp tục.");
      }

      const response = await fetch(`http://localhost:7092/api/Users/GetMemberProfileWithFullOption?userId=${userId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể tải hồ sơ: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
      }

      const data = await response.json();
      console.log('Profile data:', data); // Debug log
      
      // Handle different response structures
      let profileData = null;
      if (data.success !== undefined && data.data) {
        profileData = data.data;
      } else if (data && typeof data === "object") {
        profileData = data;
      } else {
        throw new Error("Định dạng dữ liệu hồ sơ không hợp lệ.");
      }

      // Validate and structure profile data
      const structuredProfile = {
        fullName: profileData.fullName || profileData.name || "Chưa cập nhật",
        age: profileData.age || "Chưa cập nhật",
        email: profileData.email || "Chưa cập nhật",
        phone: profileData.phone || profileData.phoneNumber || "Chưa cập nhật",
        address: profileData.address || "Chưa cập nhật",
        registeredCourses: Array.isArray(profileData.registeredCourses) ? profileData.registeredCourses : [],
        assessmentResults: Array.isArray(profileData.assessmentResults) ? profileData.assessmentResults : [],
        previousConsultants: Array.isArray(profileData.previousConsultants) ? profileData.previousConsultants : [],
      };

      setSelectedMember(structuredProfile);

    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
      showToast(`Lỗi tải hồ sơ: ${err.message}`, 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // Map status to readable format
  const mapStatus = (status) => {
    const statusMap = {
      "PENDING": "Chờ xác nhận",
      "PENDING_PAYMENT": "Chờ xác nhận",
      "CANCELED": "Hủy",
      "CANCELLED": "Hủy", // Handle both spellings
      "CONFIRMED": "Đã xác nhận",
      "COMPLETED": "Hoàn thành",
    };
    return statusMap[status] || status || "Không xác định";
  };

  // Get status badge styles
  const getStatusBadge = (status) => {
    const badgeMap = {
      "Đã xác nhận": "bg-green-100 text-green-700 ring-green-600/20",
      "Hoàn thành": "bg-blue-100 text-blue-700 ring-blue-600/20",
      "Chờ xác nhận": "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
      "Hủy": "bg-red-100 text-red-700 ring-red-600/20",
    };
    return badgeMap[status] || "bg-gray-100 text-gray-700 ring-gray-500/10";
  };

  // Modal close
  const closeModal = () => {
    setSelectedMember(null);
  };

  // Handle status update with improved error handling
  const handleUpdateStatus = async (appointmentId, action) => {
    if (!appointmentId) {
      showToast("ID lịch hẹn không hợp lệ", 'error');
      return;
    }

    setUpdateLoading(appointmentId);
    
    try {
      const token = localStorage?.getItem("token") || sessionStorage?.getItem("token");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để tiếp tục.");
      }

      let endpoint = "";
      let method = "POST";

      if (action === "confirm") {
        endpoint = `http://localhost:7092/api/Appointments/${appointmentId}/ConfirmFreeAppointment`;
      } else if (action === "cancel") {
        endpoint = `http://localhost:7092/api/Appointments/${appointmentId}/CancelAppointment`;
      } else {
        throw new Error("Hành động không hợp lệ.");
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Cập nhật thất bại. Mã lỗi: ${response.status}`);
      }

      // Refresh appointments list
      await refreshAppointments();

      const actionText = action === "confirm" ? "Đã xác nhận" : "Đã hủy";
      showToast(`Cập nhật trạng thái thành ${actionText} thành công!`, 'success');

    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message);
      showToast(`Lỗi cập nhật trạng thái: ${err.message}`, 'error');
    } finally {
      setUpdateLoading(null);
    }
  };

  // Refresh appointments helper function
  const refreshAppointments = async () => {
    try {
      const token = localStorage?.getItem("token") || sessionStorage?.getItem("token");
      const response = await fetch("http://localhost:7092/api/Appointments/GetAllAppointmentAboutConsultant", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Lỗi làm mới danh sách.");

      const fetchData = await response.json();
      let appointmentsData = fetchData.success ? fetchData.data : fetchData;
      
      if (!Array.isArray(appointmentsData)) {
        throw new Error("Định dạng dữ liệu không hợp lệ.");
      }

      const sortedData = appointmentsData.sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime));
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

      // Recalculate statistics
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
      console.error('Error refreshing appointments:', err);
      throw err;
    }
  };

  // Loading state
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

  // Error state
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
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => fetchMemberProfile(apt.userId)}
                          disabled={profileLoading}
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <User className="w-4 h-4 mr-1" />
                          Xem hồ sơ
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, "confirm")}
                          disabled={apt.rawStatus === "CONFIRMED" || apt.rawStatus === "CANCELED" || updateLoading === apt.id}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updateLoading === apt.id ? (
                            <Loader className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          )}
                          Xác nhận
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, "cancel")}
                          disabled={apt.rawStatus === "CANCELED" || updateLoading === apt.id}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {updateLoading === apt.id ? (
                            <Loader className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1" />
                          )}
                          Hủy
                        </button>
                      </div>
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-xl shadow-md">
              <h3 className="text-2xl font-bold flex items-center">
                <User className="w-6 h-6 mr-3" />
                Hồ sơ thành viên: {selectedMember.fullName}
              </h3>
              <button onClick={closeModal} className="text-gray-200 hover:text-white transition duration-200">
                <XCircle className="w-8 h-8" />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 120px)" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-lg">
                <p><strong className="font-semibold text-gray-700 flex items-center"><User className="w-5 h-5 mr-2 text-blue-500" /> Họ tên:</strong> {selectedMember.fullName}</p>
                <p><strong className="font-semibold text-gray-700 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-500" /> Tuổi:</strong> {selectedMember.age}</p>
                <p><strong className="font-semibold text-gray-700 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-blue-500" /> Email:</strong> {selectedMember.email}</p>
                <p><strong className="font-semibold text-gray-700 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-blue-500" /> Số điện thoại:</strong> {selectedMember.phone}</p>
                <p className="col-span-1 md:col-span-2"><strong className="font-semibold text-gray-700 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-blue-500" /> Địa chỉ:</strong> {selectedMember.address}</p>
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
                        <span className="font-medium">{result.stage || "Giai đoạn không xác định"}</span> - Điểm: <span className="font-semibold text-green-700 ml-1">{result.score || "N/A"}</span> 
                        {result.takeTime && (
                          <span className="text-sm text-gray-500 ml-2">(Thời gian: {new Date(result.takeTime).toLocaleString("vi-VN")})</span>
                        )}
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
                        <span className="font-medium">{consultant.consultantName || "Tên không xác định"}</span> 
                        {consultant.consultantEmail && (
                          <span className="text-gray-600 italic ml-2">({consultant.consultantEmail})</span>
                        )}
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
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