"use client";

import React from "react";
import { Search, Calendar, Clock, User, MapPin, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

class StaffAppointmentManagement extends React.Component {
    state = {
        appointments: [],
        filteredAppointments: [],
        searchTerm: "",
        statusFilter: "",
        loading: true,
        error: null,
        stats: { total: 0, pending: 0, successful: 0, failed: 0, canceled: 0 },
    };

    fetchAppointments = async () => {
        this.setState({ loading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Vui lòng đăng nhập để tiếp tục.");

            const response = await fetch("http://localhost:7092/api/Admin/GetAllAppointments", {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lấy danh sách lịch hẹn thất bại: ${errorText}`);
            }

            const data = await response.json();
            if (!data.success || !Array.isArray(data.data)) {
                throw new Error("Dữ liệu không hợp lệ từ API.");
            }

            const mappedAppointments = data.data
                .map((apt) => {
                    if (!apt.appointmentID || !apt.startDateTime) {
                        console.warn("Dữ liệu thiếu cho appointment:", apt);
                        return null;
                    }
                    return {
                        id: apt.appointmentID,
                        patientName: apt.userName || "Chưa có tên",
                        expertName: apt.consultantName || "Chưa có chuyên gia",
                        date: new Date(apt.startDateTime).toLocaleDateString("vi-VN"),
                        timeRange: `${new Date(apt.startDateTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} - ${new Date(apt.endDateTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}`, // Hiển thị khoảng thời gian
                        type: apt.type || "Tư vấn online",
                        status: this.mapStatus(apt.status, apt.paymentStatus),
                        location: apt.location || "Google Meet",
                        rawStatus: apt.status || "UNKNOWN",
                        rawPaymentStatus: apt.paymentStatus || "UNKNOWN",
                        startDateTime: new Date(apt.startDateTime), // Lưu thời gian gốc để sắp xếp
                    };
                })
                .filter((apt) => apt !== null)
                .sort((a, b) => b.startDateTime - a.startDateTime); // Sắp xếp theo thời gian giảm dần

            const total = mappedAppointments.length;
            const pending = mappedAppointments.filter((apt) => apt.status === "Chờ xác nhận").length;
            const successful = mappedAppointments.filter((apt) => apt.status === "Đã xác nhận").length;
            const failed = mappedAppointments.filter((apt) => apt.status === "Thất bại").length;
            const canceled = mappedAppointments.filter((apt) => apt.status === "Đã hủy").length;

            this.setState({
                appointments: mappedAppointments,
                filteredAppointments: mappedAppointments,
                stats: { total, pending, successful, failed, canceled },
                loading: false,
            });
        } catch (err) {
            this.setState({ error: err.message, loading: false });
            toast.error(err.message || "Lỗi tải lịch hẹn.");
        }
    };

    mapStatus = (status, paymentStatus) => {
        if (!status) return "Không xác định";
        if (status === "CANCELED") return "Đã hủy";
        if (status === "PENDING") return "Chờ xác nhận"; // Thêm xử lý cho PENDING
        if (status === "PENDING_PAYMENT") {
            if (paymentStatus === "PENDING") return "Chờ xác nhận";
            if (paymentStatus === "SUCCESS") return "Đã xác nhận";
            if (paymentStatus === "FAILED") return "Thất bại";
        }
        if (status === "CONFIRMED") return "Đã xác nhận"; // Thêm xử lý cho CONFIRMED
        return "Không xác định";
    };

    handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        this.setState((prevState) => ({
            searchTerm,
            filteredAppointments: prevState.appointments.filter(
                (apt) =>
                    apt.patientName.toLowerCase().includes(searchTerm) ||
                    apt.expertName.toLowerCase().includes(searchTerm) ||
                    apt.date.includes(searchTerm) ||
                    apt.timeRange.toLowerCase().includes(searchTerm) // Cập nhật để tìm kiếm trong timeRange
            ),
        }));
    };

    handleStatusFilter = (e) => {
        const statusFilter = e.target.value;
        this.setState((prevState) => ({
            statusFilter,
            filteredAppointments: prevState.appointments.filter(
                (apt) => (statusFilter ? apt.status === statusFilter : true)
            ),
        }));
    };

    handleUpdateStatus = async (appointmentId, action) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Vui lòng đăng nhập.");

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

            await this.fetchAppointments(); // Làm mới danh sách
            toast.success(`Cập nhật trạng thái thành ${action === "confirm" ? "Đã xác nhận" : "Đã hủy"} thành công!`);
        } catch (err) {
            toast.error(err.message || "Lỗi cập nhật trạng thái lịch hẹn.");
        }
    };

    componentDidMount() {
        this.fetchAppointments();
    }

    render() {
        const { filteredAppointments, searchTerm, statusFilter, loading, error, stats } = this.state;

        return (
            <div className="bg-white/90 rounded-2xl p-6 border border-gray-200 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý lịch hẹn</h2>
                    <button
                        onClick={this.fetchAppointments}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                        <span>Làm mới</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Tổng số</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Chờ xác nhận</h3>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Thành công</h3>
                        <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Thất bại</h3>
                        <p className="text-2xl font-bold text-orange-600">{stats.failed}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Đã hủy</h3>
                        <p className="text-2xl font-bold text-red-600">{stats.canceled}</p>
                    </div>
                </div>

                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm lịch hẹn..."
                            value={searchTerm}
                            onChange={this.handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={this.handleStatusFilter}
                        className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Thất bại">Thất bại</option>
                        <option value="Đã hủy">Đã hủy</option>
                    </select>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <div className="flex items-center gap-3 text-gray-600">
                            <RefreshCw className="w-6 h-6 animate-spin" />
                            <span className="text-lg">Đang tải...</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-md text-center">
                        <p className="text-red-700 text-lg">{error}</p>
                        <button
                            onClick={this.fetchAppointments}
                            className="mt-2 px-4 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300 transition-all"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {!loading && !error && filteredAppointments.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner">
                        <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">Không có lịch hẹn</h3>
                        <p className="text-gray-500">Thử thay đổi bộ lọc hoặc làm mới.</p>
                    </div>
                )}

                {!loading && !error && filteredAppointments.length > 0 && (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                                            <span
                                                className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                    appointment.status === "Chờ xác nhận"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : appointment.status === "Đã xác nhận"
                                                            ? "bg-green-100 text-green-800"
                                                            : appointment.status === "Thất bại"
                                                                ? "bg-orange-100 text-orange-800"
                                                                : "bg-red-100 text-red-800"
                                                }`}
                                            >
                        {appointment.status}
                      </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                <span className="text-base">Chuyên gia: {appointment.expertName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-5 h-5" />
                                                <span className="text-base">Ngày: {appointment.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-5 h-5" />
                                                <span className="text-base">Thời gian: {appointment.timeRange}</span> {/* Sử dụng timeRange */}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-5 h-5" />
                                                <span className="text-base">Địa điểm: {appointment.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => this.handleUpdateStatus(appointment.id, "confirm")}
                                            disabled={appointment.rawStatus === "CONFIRMED" || appointment.rawStatus === "CANCELED"}
                                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            <span>Xác nhận</span>
                                        </button>
                                        <button
                                            onClick={() => this.handleUpdateStatus(appointment.id, "cancel")}
                                            disabled={appointment.rawStatus === "CANCELED"}
                                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            <span>Hủy bỏ</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default StaffAppointmentManagement;