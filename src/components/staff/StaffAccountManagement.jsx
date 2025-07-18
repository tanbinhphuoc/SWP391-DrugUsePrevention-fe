"use client";

import React from "react";
import { Search, Edit2, RefreshCw, Users } from "lucide-react";
import { toast } from "react-toastify";

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-md m-4">
                    <h3 className="text-lg font-semibold text-red-700 mb-2">Đã xảy ra lỗi:</h3>
                    <p className="text-red-600 mb-4">{this.state.error?.message || "Lỗi không xác định"}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

class StaffAccountManagement extends React.Component {
    state = {
        users: [],
        searchTerm: "",
        statusFilter: "",
        loading: false,
        error: null,
        showViewModal: false,
        selectedUser: null,
        userHistory: {
            courses: [],
            appointments: [],
            assessments: [],
        },
    };

    fetchUsers = async () => {
        this.setState({ loading: true, error: null });
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Vui lòng đăng nhập với vai trò Staff để tiếp tục.");

            const response = await fetch("http://localhost:7092/api/Admin/GetAllMember", {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lấy danh sách thành viên thất bại. Mã lỗi: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            if (!data.success || !Array.isArray(data.data)) {
                throw new Error(data.message || "Dữ liệu API không hợp lệ.");
            }

            this.setState({
                users: data.data.map((user) => ({
                    id: user.userID,
                    userName: user.userName || "Chưa cập nhật",
                    email: user.email || "Chưa cập nhật",
                    fullName: user.fullName || "Chưa cập nhật",
                    dateOfBirth: user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                        : "Chưa cập nhật",
                    phone: user.phone || "Chưa cập nhật",
                    address: user.address || "Chưa cập nhật",
                    status: user.status || "Inactive",
                    role: user.roleName || "Member",
                    createdAt: new Date(user.createdAt).toLocaleString("vi-VN"),
                    updatedAt: new Date(user.updatedAt).toLocaleString("vi-VN"),
                })),
                loading: false,
            });
        } catch (err) {
            this.setState({ error: err.message || "Đã xảy ra lỗi khi tải dữ liệu.", loading: false });
            toast.error(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
        }
    };

    fetchUserHistory = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Vui lòng đăng nhập.");

            const courseRes = await fetch(`http://localhost:7092/api/Course/completed/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const courseData = await courseRes.json();
            const courses = courseRes.ok && courseData.success ? courseData.data : [];

            const apptRes = await fetch(`http://localhost:7092/api/Appointments/GetAppointmentAboutMember`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const apptData = await apptRes.json();
            const appointments = apptRes.ok && apptData.success ? apptData.data : [];

            const assessRes = await fetch(
                `http://localhost:7092/api/AssessmentResults/compare-assessments?userId=${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const assessData = await assessRes.json();
            const assessments = assessRes.ok && assessData.success ? assessData.data : [];

            this.setState({
                userHistory: { courses, appointments, assessments },
            });
        } catch (err) {
            toast.error(err.message || "Không thể lấy lịch sử người dùng.");
        }
    };

    componentDidMount() {
        this.fetchUsers();
    }

    handleSearch = (e) => this.setState({ searchTerm: e.target.value });
    handleStatusFilter = (e) => this.setState({ statusFilter: e.target.value });

    handleViewHistory = (user) => {
        this.setState({ selectedUser: user, showViewModal: true });
        this.fetchUserHistory(user.id);
    };

    handleCloseModal = () => {
        this.setState({
            showViewModal: false,
            selectedUser: null,
            userHistory: { courses: [], appointments: [], assessments: [] },
        });
    };

    render() {
        const { users, searchTerm, statusFilter, loading, error, showViewModal, selectedUser, userHistory } = this.state;

        const filteredUsers = users.filter(
            (user) =>
                user &&
                (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (statusFilter ? user.status === statusFilter : true)
        );

        return (
            <ErrorBoundary>
                <div className="bg-white/90 rounded-2xl p-6 border border-gray-200 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Quản lý thành viên</h2>
                        <button
                            onClick={this.fetchUsers}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                            <span>Làm mới</span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={this.handleSearch}
                                placeholder="Tìm kiếm theo tên, email..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={this.handleStatusFilter}
                            className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="Active">Đang hoạt động</option>
                            <option value="Inactive">Không hoạt động</option>
                        </select>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between shadow-md">
                            <span className="text-red-700">{error}</span>
                            <button
                                onClick={this.fetchUsers}
                                className="px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300 transition-all"
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center gap-3 text-gray-600">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Đang tải...</span>
                            </div>
                        </div>
                    )}

                    {!loading && !error && filteredUsers.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-inner">
                            <Users className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">Không tìm thấy thành viên</h3>
                            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc làm mới.</p>
                        </div>
                    )}

                    {!loading && !error && filteredUsers.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border-collapse rounded-lg overflow-hidden shadow-md">
                                <thead>
                                <tr className="bg-blue-50 text-gray-700">
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">ID</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Tên đăng nhập</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Email</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Họ tên</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Ngày sinh</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">SĐT</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Địa chỉ</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Trạng thái</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Ngày tạo</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Cập nhật lần cuối</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left">Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 transition-all duration-200"
                                    >
                                        <td className="px-4 py-2 border-b border-gray-200">{user.id}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{user.userName}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{user.email}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{user.fullName}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{user.dateOfBirth}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{user.phone}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{user.address}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                          {user.status === "Active" ? "Đang hoạt động" : "Không hoạt động"}
                        </span>
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-200">{user.createdAt}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">{user.updatedAt}</td>
                                        <td className="px-4 py-2 border-b border-gray-200">
                                            <button
                                                onClick={() => this.handleViewHistory(user)}
                                                className="text-blue-600 hover:text-blue-800 transition-all"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {showViewModal && selectedUser && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 p-4">
                            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-lg">
                                <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Lịch sử của {selectedUser.fullName} ({selectedUser.userName})
                                    </h3>
                                    <button
                                        onClick={this.handleCloseModal}
                                        className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Khóa học đã hoàn thành</h4>
                                        {userHistory.courses.length > 0 ? (
                                            <ul className="space-y-2">
                                                {userHistory.courses.map((course) => (
                                                    <li
                                                        key={course.courseID}
                                                        className="p-3 bg-white rounded-md border border-gray-100 hover:bg-gray-100 transition-all"
                                                    >
                                                        {course.courseName} ({course.status})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">Không có khóa học nào.</p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Lịch hẹn</h4>
                                        {userHistory.appointments.length > 0 ? (
                                            <ul className="space-y-2">
                                                {userHistory.appointments.map((appt) => (
                                                    <li
                                                        key={appt.appointmentID}
                                                        className="p-3 bg-white rounded-md border border-gray-100 hover:bg-gray-100 transition-all"
                                                    >
                                                        {appt.consultantName} -{" "}
                                                        {new Date(appt.startDateTime).toLocaleDateString("vi-VN")} ({appt.status})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">Không có lịch hẹn nào.</p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Kết quả khảo sát</h4>
                                        {userHistory.assessments.length > 0 ? (
                                            <ul className="space-y-2">
                                                {userHistory.assessments.map((assess, index) => (
                                                    <li
                                                        key={index}
                                                        className="p-3 bg-white rounded-md border border-gray-100 hover:bg-gray-100 transition-all"
                                                    >
                                                        {assess.assessmentName} - Điểm: {assess.score}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">Không có kết quả khảo sát nào.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ErrorBoundary>
        );
    }
}

export default StaffAccountManagement;