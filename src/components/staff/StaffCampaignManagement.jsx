"use client";

import React from "react";
import { Search, Edit2, Trash2, Plus, Megaphone, X, Calendar, FileText } from "lucide-react";
import { toast } from "react-toastify";

class StaffCampaignManagement extends React.Component {
    state = {
        campaigns: [],
        assessments: [],
        searchTerm: "",
        statusFilter: "",
        token: localStorage.getItem("token") || "",
        showCampaignModal: false,
        showLinkModal: false,
        formData: {
            title: "",
            content: "",
            authorID: "",
            publishDate: "",
            status: "Draft",
            linkedAssessmentId: null,
        },
        isEditing: false,
        editingCampaign: null,
        selectedCampaignId: null,
        loading: false,
        error: null,
    };

    fetchCampaigns = async () => {
        this.setState({ loading: true, error: null });
        try {
            const response = await fetch("http://localhost:7092/api/Blog/list", {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${this.state.token}`,
                },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("Invalid campaign data format");
            this.setState({ campaigns: data, loading: false });
        } catch (error) {
            this.setState({ error: error.message || "Không thể tải danh sách chương trình truyền thông.", loading: false });
            toast.error(error.message || "Không thể tải danh sách chương trình truyền thông.");
        }
    };

    fetchAssessments = async () => {
        try {
            const inputRes = await fetch("http://localhost:7092/api/Assessment/GetAllInput", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            const inputData = await inputRes.json();
            const inputAssessments = inputRes.ok && inputData.success
                ? (inputData.data || []).map((item) => ({ ...item, assessmentStage: "Input" }))
                : [];

            const outputRes = await fetch("http://localhost:7092/api/Assessment/GetAllOutput", {
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            const outputData = await outputRes.json();
            const outputAssessments = outputRes.ok && outputData.success
                ? (outputData.data || []).map((item) => ({ ...item, assessmentStage: "Output" }))
                : [];

            this.setState({ assessments: [...inputAssessments, ...outputAssessments] });
        } catch (err) {
            toast.error(err.message || "Không thể lấy danh sách bài đánh giá");
        }
    };

    componentDidMount() {
        this.fetchCampaigns();
        this.fetchAssessments();
    }

    handleSearch = (e) => this.setState({ searchTerm: e.target.value });
    handleStatusFilter = (e) => this.setState({ statusFilter: e.target.value });

    handleCreateCampaign = async (e) => {
        e.preventDefault();
        const { formData } = this.state;
        if (!formData.title || !formData.content) {
            toast.error("Vui lòng nhập tiêu đề và nội dung chương trình.");
            return;
        }

        try {
            const response = await fetch("http://localhost:7092/api/Blog", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.state.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    authorID: localStorage.getItem("userId"),
                    publishDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : null,
                    status: formData.status,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Tạo chương trình thất bại. Mã: ${response.status}`);
            this.setState((prevState) => ({
                campaigns: [...prevState.campaigns, { ...formData, blogID: data.data.blogId }],
                showCampaignModal: false,
                formData: { title: "", content: "", authorID: "", publishDate: "", status: "Draft", linkedAssessmentId: null },
            }));
            toast.success("Tạo chương trình truyền thông thành công!");
            this.fetchCampaigns();
        } catch (err) {
            toast.error(err.message || "Lỗi tạo chương trình truyền thông.");
        }
    };

    handleUpdateCampaign = async (e) => {
        e.preventDefault();
        const { formData, editingCampaign } = this.state;
        if (!formData.title || !formData.content) {
            toast.error("Vui lòng nhập tiêu đề và nội dung chương trình.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:7092/api/Blog/${editingCampaign.blogID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${this.state.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    authorID: localStorage.getItem("userId"),
                    publishDate: formData.publishDate ? new Date(formData.publishDate).toISOString() : null,
                    status: formData.status,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || `Cập nhật chương trình thất bại. Mã: ${response.status}`);
            this.setState((prevState) => ({
                campaigns: prevState.campaigns.map((item) =>
                    item.blogID === editingCampaign.blogID ? { ...formData, blogID: editingCampaign.blogID } : item,
                ),
                showCampaignModal: false,
                isEditing: false,
                editingCampaign: null,
                formData: { title: "", content: "", authorID: "", publishDate: "", status: "Draft", linkedAssessmentId: null },
            }));
            toast.success("Cập nhật chương trình truyền thông thành công!");
        } catch (err) {
            toast.error(err.message || "Lỗi cập nhật chương trình truyền thông.");
        }
    };

    handleDeleteCampaign = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa chương trình này?")) return;
        try {
            const response = await fetch(`http://localhost:7092/api/Blog/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            const data = await response.json();
            if (data.success) {
                this.setState((prevState) => ({
                    campaigns: prevState.campaigns.filter((item) => item.blogID !== id),
                }));
                toast.success("Xóa chương trình truyền thông thành công");
            } else {
                toast.error(data.message || "Không thể xóa chương trình truyền thông");
            }
        } catch (err) {
            toast.error(err.message || "Không thể xóa chương trình truyền thông");
        }
    };

    handleLinkAssessment = async (campaignId, assessmentId) => {
        try {
            const response = await fetch(`http://localhost:7092/api/Blog/LinkAssessment?blogId=${campaignId}&assessmentId=${assessmentId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${this.state.token}` },
            });
            const data = await response.json();
            if (data.success) {
                this.setState((prevState) => ({
                    campaigns: prevState.campaigns.map((item) =>
                        item.blogID === campaignId ? { ...item, linkedAssessmentId: assessmentId } : item,
                    ),
                    showLinkModal: false,
                    selectedCampaignId: null,
                }));
                toast.success("Liên kết khảo sát thành công");
            } else {
                toast.error(data.message || "Không thể liên kết khảo sát");
            }
        } catch (err) {
            toast.error(err.message || "Không thể liên kết khảo sát");
        }
    };

    handleEdit = (id) => {
        const campaign = this.state.campaigns.find((item) => item.blogID === id);
        this.setState({
            editingCampaign: campaign,
            isEditing: true,
            formData: {
                title: campaign.title,
                content: campaign.content,
                authorID: campaign.authorID,
                publishDate: campaign.publishDate ? new Date(campaign.publishDate).toISOString().split("T")[0] : "",
                status: campaign.status,
                linkedAssessmentId: campaign.linkedAssessmentId || null,
            },
            showCampaignModal: true,
        });
    };

    handleFormChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            formData: { ...prevState.formData, [name]: value },
        }));
    };

    render() {
        const {
            campaigns,
            assessments,
            searchTerm,
            statusFilter,
            showCampaignModal,
            showLinkModal,
            formData,
            isEditing,
            selectedCampaignId,
            loading,
            error,
        } = this.state;

        const filteredCampaigns = campaigns.filter(
            (campaign) =>
                campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (statusFilter ? campaign.status === statusFilter : true),
        );

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Danh sách chương trình truyền thông</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={this.fetchCampaigns}
                                disabled={loading}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                                <span>Làm mới</span>
                            </button>
                            <button
                                onClick={() => this.setState({ showCampaignModal: true, isEditing: false, formData: { title: "", content: "", authorID: "", publishDate: "", status: "Draft", linkedAssessmentId: null } })}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Thêm chương trình
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={this.handleSearch}
                                placeholder="Tìm kiếm chương trình truyền thông..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={this.handleStatusFilter}
                            className="w-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="Draft">Nháp</option>
                            <option value="Published">Đã xuất bản</option>
                        </select>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-red-800">{error}</span>
                                <button
                                    onClick={this.fetchCampaigns}
                                    className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-100 transition-colors"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="flex items-center gap-3 text-gray-600">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Đang tải chương trình truyền thông...</span>
                            </div>
                        </div>
                    )}

                    {!loading && filteredCampaigns.length === 0 && (
                        <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border-0">
                            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy chương trình truyền thông</h3>
                            <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc tạo chương trình mới</p>
                            <button
                                onClick={() => this.setState({ showCampaignModal: true, isEditing: false })}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Tạo chương trình đầu tiên
                            </button>
                        </div>
                    )}

                    {!loading && filteredCampaigns.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCampaigns.map((campaign) => (
                                <div
                                    key={campaign.blogID}
                                    className="group bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border-0 hover:shadow-lg hover:bg-white transition-all duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                                                    {campaign.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                    {campaign.content || "Không có nội dung"}
                                                </p>
                                            </div>
                                            <Megaphone className="w-6 h-6 text-blue-600 flex-shrink-0 ml-3" />
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                      <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${
                              campaign.status === "Published"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                      >
                        {campaign.status}
                      </span>
                                            {campaign.linkedAssessmentId && (
                                                <span className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                          Linked Assessment: {campaign.linkedAssessmentId}
                        </span>
                                            )}
                                        </div>
                                        <div className="space-y-2 text-sm mb-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                          Ngày xuất bản: {campaign.publishDate ? new Date(campaign.publishDate).toLocaleDateString("vi-VN") : "Chưa xuất bản"}
                        </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => this.setState({ selectedCampaignId: campaign.blogID, showLinkModal: true })}
                                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => this.handleEdit(campaign.blogID)}
                                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => this.handleDeleteCampaign(campaign.blogID)}
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {showCampaignModal && (
                        <div className="modal-overlay">
                            <div className="modal-container">
                                <div className="modal-header">
                                    <h3 className="modal-title">{isEditing ? "Chỉnh sửa chương trình" : "Tạo chương trình mới"}</h3>
                                    <button
                                        onClick={() =>
                                            this.setState({
                                                showCampaignModal: false,
                                                isEditing: false,
                                                editingCampaign: null,
                                                formData: { title: "", content: "", authorID: "", publishDate: "", status: "Draft", linkedAssessmentId: null },
                                            })
                                        }
                                        className="close-button"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={isEditing ? this.handleUpdateCampaign : this.handleCreateCampaign} className="modal-form">
                                    <div className="form-group">
                                        <label className="form-label">Tiêu đề</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={this.handleFormChange}
                                            className="form-input"
                                            placeholder="Nhập tiêu đề chương trình..."
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Nội dung</label>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={this.handleFormChange}
                                            className="form-textarea"
                                            placeholder="Nhập nội dung chương trình..."
                                            rows="5"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Ngày xuất bản</label>
                                        <input
                                            type="date"
                                            name="publishDate"
                                            value={formData.publishDate}
                                            onChange={this.handleFormChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Trạng thái</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={this.handleFormChange}
                                            className="form-select"
                                        >
                                            <option value="Draft">Nháp</option>
                                            <option value="Published">Đã xuất bản</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="submit-button">
                                        {isEditing ? "Cập nhật chương trình" : "Tạo chương trình"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {showLinkModal && (
                        <div className="modal-overlay">
                            <div className="modal-container">
                                <div className="modal-header">
                                    <h3 className="modal-title">Liên kết khảo sát với chương trình</h3>
                                    <button
                                        onClick={() => this.setState({ showLinkModal: false, selectedCampaignId: null })}
                                        className="close-button"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="modal-form">
                                    <div className="form-group">
                                        <label className="form-label">Chọn bài đánh giá</label>
                                        <select
                                            name="linkedAssessmentId"
                                            value={formData.linkedAssessmentId || ""}
                                            onChange={this.handleFormChange}
                                            className="form-select"
                                        >
                                            <option value="">Không liên kết</option>
                                            {assessments.map((assessment) => (
                                                <option key={assessment.assessmentID} value={assessment.assessmentID}>
                                                    {assessment.assessmentName} ({assessment.assessmentStage})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => this.handleLinkAssessment(selectedCampaignId, formData.linkedAssessmentId)}
                                        className="submit-button"
                                    >
                                        Liên kết
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default StaffCampaignManagement;