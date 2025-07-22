import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Plus, Search, Edit, Trash2, Eye, Filter, Calendar, X, Save } from "lucide-react";
import { toast } from "react-toastify";

// Tách BlogForm thành component hoàn toàn độc lập
const BlogForm = memo(({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEdit = false, 
  isLoading = false 
}) => {
  // Local state cho form để tránh re-render từ parent
  const [localFormData, setLocalFormData] = useState(initialData || {
    title: "",
    content: "",
    publishDate: new Date().toISOString().split('T')[0],
    status: "Active",
    thumbnail: "",
    authorAvatar: ""
  });

  // Update local state khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setLocalFormData(initialData);
    }
  }, [initialData]);

  // Local handlers - không dependency ngoài
  const handleInputChange = useCallback((field, value) => {
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(localFormData);
  }, [localFormData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề *
        </label>
        <input
          type="text"
          value={localFormData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoComplete="off"
          placeholder="Nhập tiêu đề bài viết..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nội dung *
        </label>
        <textarea
          value={localFormData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          required
          autoComplete="off"
          placeholder="Nhập nội dung bài viết..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày xuất bản
          </label>
          <input
            type="date"
            value={localFormData.publishDate}
            onChange={(e) => handleInputChange('publishDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={localFormData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Thumbnail
        </label>
        <input
          type="url"
          value={localFormData.thumbnail}
          onChange={(e) => handleInputChange('thumbnail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
          autoComplete="off"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Avatar tác giả
        </label>
        <input
          type="url"
          value={localFormData.authorAvatar}
          onChange={(e) => handleInputChange('authorAvatar', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/avatar.jpg"
          autoComplete="off"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}</span>
        </button>
      </div>
    </form>
  );
});

BlogForm.displayName = 'BlogForm';

const StaffBlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publishDate: new Date().toISOString().split('T')[0],
    status: "Active",
    thumbnail: "",
    authorAvatar: ""
  });

  // Lấy token từ storage
  const getToken = useCallback(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("tempToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiếp tục!");
    }
    return token;
  }, []);

  // Fetch blogs từ API
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setBlogs([]);
        return;
      }

      const response = await fetch("http://localhost:7092/api/Blog/ListOfBlog", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Lỗi ${response.status}` }));
        throw new Error(errorData.message || `Lỗi ${response.status}`);
      }

      const data = await response.json();
      setBlogs(Array.isArray(data) ? data.map(blog => ({
        ...blog,
        blogID: blog.BlogID, // Đồng bộ hóa tên trường nếu cần
        title: blog.Title,
        content: blog.Content,
        publishDate: blog.PublishDate,
        status: blog.Status,
        thumbnail: blog.Thumbnail,
        authorAvatar: blog.AuthorAvatar,
        createdBy: blog.CreatedBy
      })) : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error(`Không thể tải danh sách blog: ${error.message}`);
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  // Handle form input changes - Stable reference với useCallback
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      content: "",
      publishDate: new Date().toISOString().split('T')[0],
      status: "Active",
      thumbnail: "",
      authorAvatar: ""
    });
  }, []);

  // Tạo blog mới
  const handleCreateBlog = useCallback(async (formDataFromForm) => {
    if (!formDataFromForm.title.trim() || !formDataFromForm.content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) return;

      const requestBody = {
        title: formDataFromForm.title.trim(),
        content: formDataFromForm.content.trim(),
        publishDate: formDataFromForm.publishDate,
        status: formDataFromForm.status,
        thumbnail: formDataFromForm.thumbnail?.trim() || "",
        authorAvatar: formDataFromForm.authorAvatar?.trim() || ""
      };

      const response = await fetch("http://localhost:7092/api/Blog/CreateBlog", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Lỗi ${response.status}` }));
        throw new Error(errorData.message || `Lỗi ${response.status}`);
      }

      toast.success("Tạo blog thành công!");
      setShowCreateModal(false);
      resetForm();
      await fetchBlogs();
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(`Không thể tạo blog: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, resetForm, fetchBlogs]);

  // Cập nhật blog
  const handleUpdateBlog = useCallback(async (formDataFromForm) => {
    if (!formDataFromForm.title.trim() || !formDataFromForm.content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token || !editingBlog) return;

      const requestBody = {
        blogID: editingBlog.blogID,
        title: formDataFromForm.title.trim(),
        content: formDataFromForm.content.trim(),
        publishDate: formDataFromForm.publishDate,
        status: formDataFromForm.status,
        thumbnail: formDataFromForm.thumbnail?.trim() || "",
        authorAvatar: formDataFromForm.authorAvatar?.trim() || ""
      };

      const response = await fetch(`http://localhost:7092/api/Blog/${editingBlog.blogID}/UpdateBlog`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Lỗi ${response.status}` }));
        throw new Error(errorData.message || `Lỗi ${response.status}`);
      }

      toast.success("Cập nhật blog thành công!");
      setShowEditModal(false);
      setEditingBlog(null);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(`Không thể cập nhật blog: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [editingBlog, getToken, resetForm, fetchBlogs]);

  // Xóa blog
  const handleDeleteBlog = useCallback(async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`http://localhost:7092/api/Blog/${id}/DeleteBlog`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Lỗi ${response.status}` }));
        throw new Error(errorData.message || `Lỗi ${response.status}`);
      }

      toast.success("Xóa blog thành công!");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(`Không thể xóa blog: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, fetchBlogs]);

  // Mở modal chỉnh sửa
  const handleEditClick = useCallback((blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || "",
      content: blog.content || "",
      publishDate: blog.publishDate ? blog.publishDate.split('T')[0] : new Date().toISOString().split('T')[0],
      status: blog.status || "Active",
      thumbnail: blog.thumbnail || "",
      authorAvatar: blog.authorAvatar || ""
    });
    setShowEditModal(true);
  }, []);

  // Modal handlers
  const handleCreateModalClose = useCallback(() => {
    setShowCreateModal(false);
    resetForm();
  }, [resetForm]);

  const handleEditModalClose = useCallback(() => {
    setShowEditModal(false);
    setEditingBlog(null);
    resetForm();
  }, [resetForm]);

  const handleCreateModalOpen = useCallback(() => {
    resetForm();
    setShowCreateModal(true);
  }, [resetForm]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Lọc blogs với useMemo để tránh re-calculation không cần thiết
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || blog.status?.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchTerm, filterStatus]);

  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Hoạt động" },
      inactive: { bg: "bg-red-100", text: "text-red-800", label: "Không hoạt động" }
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig.active;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  }, []);

  const Modal = memo(({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    );
  });

  Modal.displayName = 'Modal';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý Blogs</h1>
            <p className="text-slate-600 mt-1">Quản lý nội dung blog và bài viết</p>
          </div>
          <button
            onClick={handleCreateModalOpen}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bài viết mới</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{blogs.length}</div>
            <div className="text-sm text-blue-600">Tổng bài viết</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {blogs.filter(b => b.status?.toLowerCase() === 'active').length}
            </div>
            <div className="text-sm text-green-600">Đang hoạt động</div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">
              {blogs.filter(b => b.status?.toLowerCase() === 'inactive').length}
            </div>
            <div className="text-sm text-red-600">Không hoạt động</div>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-slate-400 text-lg mb-2">Đang tải...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.blogID}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{blog.title}</h3>
                        {getStatusBadge(blog.status)}
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {blog.content?.substring(0, 150)}...
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('vi-VN') : 'N/A'}
                          </span>
                        </span>
                        <span>ID: {blog.blogID}</span>
                        {blog.createdBy && <span>Tạo bởi: User #{blog.createdBy}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditClick(blog)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Chỉnh sửa"
                        disabled={isLoading}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.blogID)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Xóa"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-2">
                {blogs.length === 0 ? "Chưa có bài viết nào" : "Không tìm thấy bài viết nào"}
              </div>
              <p className="text-slate-500">
                {blogs.length === 0 
                  ? "Sử dụng nút 'Tạo bài viết mới' phía trên để bắt đầu" 
                  : "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onClose={handleCreateModalClose}
        title="Tạo bài viết mới"
      >
        <BlogForm 
          initialData={{
            title: "",
            content: "",
            publishDate: new Date().toISOString().split('T')[0],
            status: "Active",
            thumbnail: "",
            authorAvatar: ""
          }}
          onSubmit={handleCreateBlog} 
          onCancel={handleCreateModalClose}
          isEdit={false}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onClose={handleEditModalClose}
        title="Chỉnh sửa bài viết"
      >
        <BlogForm 
          initialData={formData}
          onSubmit={handleUpdateBlog} 
          onCancel={handleEditModalClose}
          isEdit={true}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};

export default StaffBlogManagement;
